import { NextRequest, NextResponse } from 'next/server'
import { appendRow } from '@/lib/sheets'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, attending, guests, functions, diet, message, side } = body

  if (!name?.trim() || !attending) {
    return NextResponse.json({ error: 'Name and attendance required' }, { status: 400 })
  }

  const tab = side === 'groom' ? 'RSVPs_Groom' : 'RSVPs'

  try {
    await appendRow(tab, [
      new Date().toISOString(),
      name.trim(),
      email?.trim() || '',
      attending,
      attending === 'yes' ? Math.max(1, parseInt(guests) || 1) : '',
      attending === 'yes' ? (Array.isArray(functions) ? functions.join(', ') : '') : '',
      diet || '',
      message?.trim() || '',
    ])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('RSVP error:', err)
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 })
  }
}
