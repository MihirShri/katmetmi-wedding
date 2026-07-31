import { NextRequest, NextResponse } from 'next/server'
import { appendRow, getRows } from '@/lib/sheets'

export async function GET() {
  try {
    const rows = await getRows('GuestBook')
    // Row 0 is headers — skip it, reverse for newest-first
    const messages = rows.slice(1).reverse().map((row, i) => ({
      id: row[1] || String(i),
      name: row[2] || '',
      message: row[3] || '',
    }))
    return NextResponse.json({ messages })
  } catch (err) {
    console.error('Guestbook GET error:', err)
    return NextResponse.json({ messages: [] })
  }
}

export async function POST(req: NextRequest) {
  const { name, message } = await req.json()

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name and message required' }, { status: 400 })
  }

  const id = `gb-${Date.now()}`
  try {
    await appendRow('GuestBook', [
      new Date().toISOString(),
      id,
      name.trim(),
      message.trim(),
    ])
    return NextResponse.json({ message: { id, name: name.trim(), message: message.trim() } })
  } catch (err) {
    console.error('Guestbook POST error:', err)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}
