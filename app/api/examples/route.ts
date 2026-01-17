import { NextResponse } from 'next/server'

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://localhost:8000'

export async function GET() {
  try {
    const response = await fetch(`${EXTERNAL_API_URL}/api/examples`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch examples' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Proxy the image URLs through our API
    const examples = data.examples.map((example: any) => ({
      ...example,
      image_url: `/api/asset/${example.job_id}?asset_type=image`,
    }))

    return NextResponse.json({ examples })

  } catch (error) {
    console.error('[Examples] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch examples' },
      { status: 500 }
    )
  }
}
