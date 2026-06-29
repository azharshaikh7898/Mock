import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const CreateSessionSchema = z.object({
  interviewType: z.enum(['BEHAVIORAL', 'TECHNICAL', 'SYSTEM_DESIGN', 'HR_CULTURE_FIT']),
})

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { userId } = verifyToken(token)

    const sessions = await prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      include: { feedback: true },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { userId } = verifyToken(token)

    const body = await request.json()
    const { interviewType } = CreateSessionSchema.parse(body)

    const session = await prisma.interviewSession.create({
      data: {
        userId,
        interviewType,
        status: 'IN_PROGRESS',
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Create session error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
