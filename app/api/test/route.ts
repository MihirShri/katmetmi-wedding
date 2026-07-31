import { NextResponse } from 'next/server'
import { getRows } from '@/lib/sheets'

export async function GET() {
  try {
    const rows = await getRows('GuestBook')
    return NextResponse.json({ ok: true, rowCount: rows.length })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
