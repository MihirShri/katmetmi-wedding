import { NextRequest, NextResponse } from 'next/server'
import { appendRow } from '@/lib/sheets'

export async function POST(req: NextRequest) {
  const { song, artist, from: requestedBy } = await req.json()

  if (!song?.trim()) {
    return NextResponse.json({ error: 'Song name required' }, { status: 400 })
  }

  try {
    await appendRow('SongRequests', [
      new Date().toISOString(),
      song.trim(),
      artist?.trim() || '',
      requestedBy?.trim() || '',
    ])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Song request error:', err)
    return NextResponse.json({ error: 'Failed to save song request' }, { status: 500 })
  }
}
