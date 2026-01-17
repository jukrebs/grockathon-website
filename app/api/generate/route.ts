import { NextRequest, NextResponse } from 'next/server'

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (prompt.length < 3) {
      return NextResponse.json({ error: 'Prompt must be at least 3 characters' }, { status: 400 })
    }

    // Start generation job
    const generateResponse = await fetch(`${EXTERNAL_API_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt.trim() }),
    })

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || 'Failed to start generation' },
        { status: generateResponse.status }
      )
    }

    const { job_id } = await generateResponse.json()

    // Return job_id for client-side polling
    return NextResponse.json({ job_id })

  } catch (error) {
    console.error('Generation error:', error)
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Unable to connect to generation service' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
