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
    let assistantCount = -1
    let fileCount = -1

    try {
      // IMPORT ASSISTANTS (Saved custom agents/prompts)
      const assistants = await openai.beta.assistants.list({ limit: 20 })
      console.log('Assistants API response:', JSON.stringify(assistants, null, 2))
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

      // IMPORT FILES (Documents uploaded for RAG or Fine-tuning)
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
      // We return what we have even if one call fails
    }

    // Prepare final UI-ready array
    const conversations = [
      {
        id: 'header-id',
        title: '🌐 OpenAI Cloud Sync Complete',
        summary: `Imported ${assistantCount} assistant(s) and ${fileCount} file(s) from your OpenAI account.`,
        created_at: new Date().toISOString(),
        source: 'system',
        details: {
          assistants: assistantCount,
          files: fileCount
        }
      },
      ...remoteItems
    ]

    return NextResponse.json({
      success: true,
      total_found: remoteItems.length,
      assistants: assistantCount,
      files: fileCount,
      conversations,
      message: `Imported ${assistantCount} assistant(s) and ${fileCount} file(s) from your OpenAI account. Only these types of objects are available for import via the OpenAI API.`
    })

  } catch (error: any) {
    console.error('[OpenAI Import Error]:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to import OpenAI data' },
      { status: 500 }
    )
  }
}

