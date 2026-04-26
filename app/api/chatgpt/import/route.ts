import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, apiKey } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Use provided key or fallback to environment variable
    const openaiApiKey = apiKey || process.env.OPENAI_API_KEY1
    
    if (!openaiApiKey) {
      return NextResponse.json({ error: 'No API Key found' }, { status: 401 })
    }

    const openai = new OpenAI({ apiKey: openaiApiKey })
    let remoteItems: any[] = []
    let projectCount = 0
    let assistantCount = 0
    let fileCount = 0

    try {
      // 1. IMPORT PROJECTS (Enterprise/Team Workspace structures)
      const projects = await openai.projects.list()
      projectCount = projects.data.length
      projects.data.forEach((p: any) => {
        remoteItems.push({
          id: p.id,
          title: `🚀 Project: ${p.name}`,
          summary: `Status: ${p.status} | OpenAI Workspace`,
          content: `Project Identifier: ${p.id}\nCreated: ${new Date(p.created_at * 1000).toLocaleString()}`,
          created_at: new Date(p.created_at * 1000).toISOString(),
          source: 'openai-project'
        })
      })

      // 2. IMPORT ASSISTANTS (Saved custom agents/prompts)
      const assistants = await openai.beta.assistants.list({ limit: 20 })
      assistantCount = assistants.data.length
      assistants.data.forEach((asst: any) => {
        remoteItems.push({
          id: asst.id,
          title: `🤖 Assistant: ${asst.name || 'Unnamed'}`,
          summary: `Model: ${asst.model} | Saved Prompt/Instructions`,
          content: asst.instructions || 'No instructions provided.',
          created_at: new Date(asst.created_at * 1000).toISOString(),
          source: 'openai-assistant'
        })
      })

      // 3. IMPORT FILES (Documents uploaded for RAG or Fine-tuning)
      const files = await openai.files.list()
      fileCount = files.data.length
      files.data.forEach((f: any) => {
        remoteItems.push({
          id: f.id,
          title: `📄 Cloud File: ${f.filename}`,
          summary: `Purpose: ${f.purpose} | Size: ${f.bytes} bytes`,
          content: `File ID: ${f.id}\nDownload this file via the OpenAI dashboard or Files API.`,
          created_at: new Date(f.created_at * 1000).toISOString(),
          source: 'openai-file'
        })
      })

    } catch (apiErr: any) {
      console.error('OpenAI Fetch Error:', apiErr.message)
      // We return what we have even if one call fails (e.g., if user lacks Project permissions)
    }

    // Prepare final UI-ready array
    const conversations = [
      {
        id: 'header-id',
        title: '🌐 OpenAI Cloud Sync Complete',
        summary: `Imported ${projectCount} project(s), ${assistantCount} assistant(s), and ${fileCount} file(s) from your OpenAI account.`,
        created_at: new Date().toISOString(),
        source: 'system',
        details: {
          projects: projectCount,
          assistants: assistantCount,
          files: fileCount
        }
      },
      ...remoteItems
    ]

    return NextResponse.json({
      success: true,
      total_found: remoteItems.length,
      projects: projectCount,
      assistants: assistantCount,
      files: fileCount,
      conversations,
      message: `Imported ${projectCount} project(s), ${assistantCount} assistant(s), and ${fileCount} file(s) from your OpenAI account. Only these types of objects are available for import via the OpenAI API.`
    })

  } catch (error: any) {
    console.error('[OpenAI Import Error]:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to import OpenAI data' },
      { status: 500 }
    )
  }
}

