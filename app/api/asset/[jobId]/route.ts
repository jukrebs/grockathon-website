import { NextRequest, NextResponse } from 'next/server'

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://localhost:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const jobId = params.jobId
  const { searchParams } = new URL(request.url)
  const assetType = searchParams.get('asset_type')

  console.log(`[Asset] Fetching ${assetType} for job ${jobId}`)

  if (!assetType || !['glb', 'usdz', 'image'].includes(assetType)) {
    return NextResponse.json(
      { error: 'Invalid asset type. Must be: glb, usdz, or image' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${EXTERNAL_API_URL}/api/asset/${jobId}?asset_type=${assetType}`,
      { cache: 'no-store' }
    )

    console.log(`[Asset] Response status: ${response.status}`)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: response.status }
      )
    }

    const buffer = await response.arrayBuffer()
    console.log(`[Asset] Got ${buffer.byteLength} bytes`)
    
    // Set appropriate content type and headers
    const contentTypes: Record<string, string> = {
      glb: 'model/gltf-binary',
      usdz: 'model/vnd.usdz+zip',
      image: 'image/jpeg',
    }

    const extensions: Record<string, string> = {
      glb: 'glb',
      usdz: 'usdz',
      image: 'jpg',
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentTypes[assetType],
        'Content-Disposition': `attachment; filename="model.${extensions[assetType]}"`,
        'Access-Control-Allow-Origin': '*',
      },
    })

  } catch (error) {
    console.error('[Asset] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    )
  }
}
