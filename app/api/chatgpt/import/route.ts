import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    console.log('[ChatGPT API] Request received')
    
    let userId: string | null = null
    let providedApiKey: string | null = null
    
    try {
      const body = await request.json()
      userId = body.userId
      providedApiKey = body.apiKey || null
    } catch (parseError) {
      console.error('[ChatGPT API] Failed to parse request body:', parseError)
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Determine which API key to use
    const openaiApiKey = providedApiKey || process.env.OPENAI_API_KEY1
    
    if (!openaiApiKey) {
      console.warn('[ChatGPT API] No API key found, falling back to mock data')
      return getMockConversations()
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    try {
      console.log('[ChatGPT API] Verifying connection via Chat Completion...')
      
      /**
       * We use Chat Completions here because listing threads 
       * (openai.beta.threads.list) often fails or requires specific 
       * beta headers/versions that cause the error you saw.
       */
      await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
      })
      
      const conversations = [
        {
          id: 'import-ready-1',
          title: 'OpenAI Connection Active',
          summary: 'Your OpenAI API key has been successfully verified.',
          created_at: new Date().toISOString(),
          message_count: 0,
        },
      ]

      return NextResponse.json({
        success: true,
        conversations,
        message: 'OpenAI API key verified successfully.',
        source: 'openai',
      })

    } catch (openaiError: any) {
      console.error('[ChatGPT API] OpenAI SDK Error:', openaiError.message)
      
      const status = openaiError.status || 500
      const message = openaiError.message || 'Failed to connect to OpenAI'
      
      return NextResponse.json(
        { error: `OpenAI API error: ${message}` },
        { status: status }
      )
    }

  } catch (error: any) {
    console.error('[ChatGPT API] Global Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}

function getMockConversations() {
  const mockConversations = [
    {
      id: 'conv-1',
      title: 'Web Development Best Practices',
      summary: 'Discussion about modern web development practices.',
      created_at: new Date().toISOString(),
      message_count: 12,
    }
  ]
  
  return NextResponse.json({
    success: true,
    conversations: mockConversations,
    message: 'Using demo data (API key not configured)',
    isDemo: true,
    source: 'mock',
  })
}
