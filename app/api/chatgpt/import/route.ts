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

    let remoteItems: any[] = []
    let fileCount = -1

    try {
      // IMPORT FILES using direct HTTP request
      const fileRes = await fetch('https://api.openai.com/v1/files', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
      })
      const files = await fileRes.json()
      console.log('Files API response:', JSON.stringify(files, null, 2))
      fileCount = Array.isArray(files.data) ? files.data.length : 0
      if (Array.isArray(files.data)) {
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
      }

    } catch (apiErr: any) {
      console.error('OpenAI Fetch Error:', apiErr.message)
      // We return what we have even if one call fails
    }

    // Prepare final UI-ready array
    const conversations = [
      {
        id: 'header-id',
        title: '🌐 OpenAI Cloud Sync Complete',
        summary: `Imported ${fileCount} file(s) from your OpenAI account.`,
        created_at: new Date().toISOString(),
        source: 'system',
        details: {
          files: fileCount
        }
      },
      ...remoteItems
    ]

    return NextResponse.json({
      success: true,
      total_found: remoteItems.length,
      files: fileCount,
      conversations,
      message: `Imported ${fileCount} file(s) from your OpenAI account. Only files are available for import via the OpenAI API.`
    })

  } catch (error: any) {
    console.error('[OpenAI Import Error]:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to import OpenAI data' },
      { status: 500 }
    )
  }
}

