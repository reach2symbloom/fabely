import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

// Helper function to recursively read files
function getWorkspaceContents(dir: string, fileList: any[] = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    // Skip node_modules and .git for performance and security
    if (file === 'node_modules' || file === '.next' || file === '.git') return

    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      getWorkspaceContents(filePath, fileList)
    } else {
      const content = fs.readFileSync(filePath, 'utf8')
      fileList.push({
        fileName: file,
        path: filePath,
        content: content.substring(0, 500) // Truncating for display safety
      })
    }
  })
  return fileList
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, apiKey } = body
    
    // 1. Get Workspace Data
    // process.cwd() points to the root of your project
    const rootPath = process.cwd()
    const workspaceData = getWorkspaceContents(rootPath)

    // 2. Setup OpenAI
    const openaiApiKey = apiKey || process.env.OPENAI_API_KEY1
    let openaiVerified = false

    if (openaiApiKey) {
      const openai = new OpenAI({ apiKey: openaiApiKey })
      try {
        await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5,
        })
        openaiVerified = true
      } catch (e) {
        console.error("OpenAI Verification failed")
      }
    }

    // 3. Return both Workspace Content and API status
    return NextResponse.json({
      success: true,
      message: 'Workspace contents retrieved',
      workspace: workspaceData,
      openaiStatus: openaiVerified ? 'Connected' : 'Not Connected',
      count: workspaceData.length
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    )
  }
}
