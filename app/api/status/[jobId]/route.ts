import { NextRequest, NextResponse } from 'next/server'

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://localhost:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params

    const response = await fetch(`${EXTERNAL_API_URL}/api/status/${jobId}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || 'Failed to get status' },
        { status: response.status }
      )
    }

    const status = await response.json()

    // If complete, include asset URLs (proxied through our API)
    if (status.status === 'complete') {
      return NextResponse.json({
        ...status,
        glbUrl: `/api/asset/${jobId}?asset_type=glb`,
        usdzUrl: `/api/asset/${jobId}?asset_type=usdz`,
      })
    }

    return NextResponse.json(status)

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
