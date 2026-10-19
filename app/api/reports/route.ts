import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const reportSchema = z.object({
  reporterId: z.string().min(1),
  reporterName: z.string().min(1),
  targetType: z.enum(['LISTING', 'USER']),
  targetId: z.string().min(1),
  reason: z.string().min(5),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = reportSchema.parse(body)

    const newReport = {
      id: `rep-${Date.now()}`,
      reporterId: data.reporterId,
      reporterName: data.reporterName,
      targetType: data.targetType,
      targetId: data.targetId,
      reason: data.reason,
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    }

    db.reports.unshift(newReport)
    return NextResponse.json({ success: true, report: newReport })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error filing report' }, { status: 400 })
  }
}
