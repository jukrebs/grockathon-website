import { NextRequest, NextResponse } from 'next/server'

// Configure your external API endpoint here
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (prompt.length < 3) {
      return NextResponse.json(
        { error: 'Prompt must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt must be less than 500 characters' },
        { status: 400 }
      )
    }

    // Call external API to generate 3D model
    const response = await fetch(`${EXTERNAL_API_URL}/api/generate-3d`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required auth headers here
        // 'Authorization': `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        formats: ['glb', 'usdz'], // Request both formats for web and AR
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('External API error:', errorData)
      
      return NextResponse.json(
        { error: errorData.message || 'Failed to generate 3D model' },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Validate response has required URLs
    if (!data.glbUrl || !data.usdzUrl) {
      return NextResponse.json(
        { error: 'Invalid response from generation service' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      glbUrl: data.glbUrl,
      usdzUrl: data.usdzUrl,
      name: data.name || prompt.trim(),
    })

  } catch (error) {
    console.error('Generation error:', error)
    
    // Check if it's a connection error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Unable to connect to generation service. Please try again later.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'FORGE 3D Generator API',
    endpoints: {
      generate: 'POST /api/generate - Generate 3D model from prompt'
    }
  })
}
