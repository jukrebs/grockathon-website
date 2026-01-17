import { NextRequest, NextResponse } from 'next/server'

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://localhost:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const jobId = params.jobId
  
  console.log(`[Status] Checking job ${jobId} at ${EXTERNAL_API_URL}`)
  
  try {
    const response = await fetch(`${EXTERNAL_API_URL}/api/status/${jobId}`, {
      cache: 'no-store',
    })
    
    console.log(`[Status] Response status: ${response.status}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log(`[Status] Error:`, errorData)
      return NextResponse.json(
        { error: errorData.error || 'Failed to get status' },
        { status: response.status }
      )
    }

    const status = await response.json()
    console.log(`[Status] Job status:`, status.status, status.stage, status.progress)

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
    console.error('[Status] Error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
