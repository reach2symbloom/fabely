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
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    if (!userId) {
      console.error('[ChatGPT API] Missing userId')
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    console.log('[ChatGPT API] Processing request for userId:', userId)
    console.log('[ChatGPT API] Provided API key:', providedApiKey ? 'Yes' : 'No')

    // Real ChatGPT Integration with OpenAI API
    // Prefer provided API key, then fall back to environment variable
    const openaiApiKey = providedApiKey || process.env.OPENAI_API_KEY1
    if (!openaiApiKey) {
      console.warn('[ChatGPT API] No API key provided and OPENAI_API_KEY1 not configured, using mock data')
      // Fallback to mock data if API key is not set
      return getMockConversations()
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    try {
      console.log('[ChatGPT API] Fetching conversations from OpenAI API...')
      
      // Fetch conversation list
      const response = await openai.beta.threads.list({
        limit: 100,
      })
      
      const conversations = (response.data || []).map((thread: any, index: number) => ({
        id: thread.id,
        title: thread.metadata?.title || `Conversation ${index + 1}`,
        summary: thread.metadata?.summary || 'No summary available',
        created_at: new Date(thread.created_at * 1000).toISOString(),
        message_count: thread.metadata?.message_count || 0,
      }))

      console.log('[ChatGPT API] Retrieved', conversations.length, 'conversations from OpenAI')
      
      return NextResponse.json({
        success: true,
        conversations,
        message: `Successfully imported ${conversations.length} ChatGPT conversations`,
        source: 'openai',
      })
    } catch (openaiError: any) {
      console.error('[ChatGPT API] OpenAI API error:', openaiError.message)
      
      // If API fails, provide helpful error message
      const errorMsg = openaiError.message || 'Failed to fetch from OpenAI'
      if (errorMsg.includes('401')) {
        const keySource = providedApiKey ? 'provided API key' : 'OPENAI_API_KEY1 environment variable'
        return NextResponse.json(
          { error: `Invalid OpenAI API key. Check your ${keySource}` },
          { status: 401 }
        )
      }
      if (errorMsg.includes('429')) {
        return NextResponse.json(
          { error: 'OpenAI API rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      
      return NextResponse.json(
        { error: `OpenAI API error: ${errorMsg}` },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('[ChatGPT API] Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to import ChatGPT data' },
      { status: 500 }
    )
  }
}

// Fallback mock data function
function getMockConversations() {
  const mockConversations = [
    {
      id: 'conv-1',
      title: 'Web Development Best Practices',
      summary: 'Discussion about modern web development practices and frameworks.',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      message_count: 12,
    },
    {
      id: 'conv-2',
      title: 'Database Optimization',
      summary: 'Tips and strategies for optimizing database queries and performance.',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      message_count: 8,
    },
    {
      id: 'conv-3',
      title: 'API Design Principles',
      summary: 'RESTful API design and best practices for creating maintainable APIs.',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      message_count: 15,
    },
    {
      id: 'conv-4',
      title: 'React Hooks Deep Dive',
      summary: 'Understanding useState, useEffect, and custom hooks in React applications.',
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      message_count: 20,
    },
    {
      id: 'conv-5',
      title: 'TypeScript Advanced Types',
      summary: 'Mastering generics, utility types, and advanced TypeScript concepts.',
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      message_count: 18,
    },
    {
      id: 'conv-6',
      title: 'Next.js Performance Optimization',
      summary: 'Techniques for optimizing Next.js applications for better performance.',
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      message_count: 14,
    },
  ]

  console.log('[ChatGPT API] Returning', mockConversations.length, 'mock conversations (fallback)')
  
  return NextResponse.json({
    success: true,
    conversations: mockConversations,
    message: `Successfully loaded ${mockConversations.length} ChatGPT conversations (demo data - API key not configured)`,
    isDemo: true,
    source: 'mock',
  })
}


