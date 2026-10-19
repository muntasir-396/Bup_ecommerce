import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  studentId: z.string().optional(),
  department: z.string().optional(),
  faculty: z.string().optional(),
  password: z.string().min(4),
})

const loginSchema = z.object({
  identifier: z.string().min(3), // studentId or email
  password: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'login'
    const body = await req.json()

    if (action === 'register') {
      const data = registerSchema.parse(body)
      const existing = db.users.find((u) => u.email === data.email || (data.studentId && u.studentId === data.studentId))
      if (existing) {
        return NextResponse.json({ error: 'User with this email or student ID already exists' }, { status: 400 })
      }

      const isBup = Boolean(data.studentId || data.email.endsWith('@bup.edu.bd'))
      const newUser = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        studentId: data.studentId,
        department: data.department || (isBup ? 'FST / FBS' : undefined),
        faculty: data.faculty || (isBup ? 'BUP Campus' : undefined),
        role: 'USER' as const,
        isBupVerified: isBup,
        isSeller: false,
        createdAt: new Date().toISOString(),
      }

      db.users.push(newUser)
      return NextResponse.json({ success: true, user: newUser })
    }

    if (action === 'login') {
      const data = loginSchema.parse(body)
      const user = db.users.find(
        (u) => u.email === data.identifier || (u.studentId && u.studentId === data.identifier)
      )

      if (!user) {
        // Fallback demo student if matching ID pattern
        if (data.identifier === '22041108' || data.identifier.includes('tanvir')) {
          const tanvir = db.users.find((u) => u.id === 'user-1')
          return NextResponse.json({ success: true, user: tanvir })
        }
        return NextResponse.json({ error: 'Invalid Student ID or password credentials' }, { status: 401 })
      }

      return NextResponse.json({ success: true, user })
    }

    if (action === 'verify-id') {
      const { userId, studentId } = body
      const user = db.users.find((u) => u.id === userId)
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

      user.studentId = studentId
      user.isBupVerified = true
      return NextResponse.json({ success: true, user })
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Validation error' }, { status: 400 })
  }
}
