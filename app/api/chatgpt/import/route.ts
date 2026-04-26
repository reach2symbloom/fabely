import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

/**
 * Recursively reads the workspace directory.
 */
function getWorkspaceContents(dir: string, fileList: any[] = []) {
  try {
    const files = fs.readdirSync(dir)
    files.forEach((file) => {
      const filePath = path.join(dir, file)
      const excludedNames = ['node_modules', '.next', '.git', 'dist', 'out', '.vercel']
      if (excludedNames.includes(file)) return

      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        getWorkspaceContents(filePath, fileList)
      } else {
        const ext = path.extname(file).toLowerCase()
        const allowedExts = ['.ts', '.tsx', '.js', '.jsx', '.json', '.txt', '.md', '.css']
        
        if (allowedExts.includes(ext)) {
          const content = fs.readFileSync(filePath, 'utf8')
          fileList.push({
            id: `local-${Math.random().toString(36).substr(2, 9)}`,
            title: file,
            path: filePath.replace(process.cwd(), ''),
            summary: `Local file: ${file}`,
            content: content,
            created_at: new Date().toISOString(),
            source: 'local'
          })
        }
      }
    })
  } catch (err) {
    console.error('Error reading directory:', err)
  }
  return fileList
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, apiKey } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const openaiApiKey = apiKey || process.env.OPENAI_API_KEY1
    const workspaceFiles = getWorkspaceContents(process.cwd())
    let remoteProjects: any[] = []

    // 1. Fetch Remote Projects/Prompts from OpenAI
    if (openaiApiKey) {
      const openai = new OpenAI({ apiKey: openaiApiKey })
      
      try {
        // Fetching Projects (For OpenAI Organizations/Teams)
        // Note: This requires the API key to have Project Management permissions
        const projectsResponse = await openai.projects.list()
        
        for (const project of projectsResponse.data) {
          remoteProjects.push({
            id: project.id,
            title: `🚀 Project: ${project.name}`,
            summary: `OpenAI Project - Status: ${project.status}`,
            created_at: new Date(project.created_at * 1000).toISOString(),
            content: `Project ID: ${project.id}\nOrganization ID: ${project.organization_id}`,
            source: 'openai-project'
          })
        }

        // Fetching Files uploaded to OpenAI (Used in Prompts/Assistants)
        const filesResponse = await openai.files.list()
        filesResponse.data.forEach(file => {
          remoteProjects.push({
            id: file.id,
            title: `☁️ Remote: ${file.filename}`,
            summary: `OpenAI Hosted File (${file.purpose})`,
            created_at: new Date(file.created_at * 1000).toISOString(),
            content: `Remote file ID: ${file.id}`,
            source: 'openai-file'
          })
        })

      } catch (authError: any) {
        console.error('OpenAI Remote Fetch Error:', authError.message)
      }
    }

    // 2. Consolidate everything
    const conversations = [
      {
        id: 'status-header',
        title: '📊 Import Dashboard',
        summary: `Imported ${workspaceFiles.length} local files and ${remoteProjects.length} OpenAI objects.`,
        created_at: new Date().toISOString(),
        message_count: workspaceFiles.length + remoteProjects.length,
        source: 'system'
      },
      ...workspaceFiles,
      ...remoteProjects
    ]

    return NextResponse.json({
      success: true,
      conversations,
      stats: {
        local: workspaceFiles.length,
        remote: remoteProjects.length
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
