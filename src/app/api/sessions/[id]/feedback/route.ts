import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { userId } = verifyToken(token)

    const feedback = await prisma.interviewFeedback.findUnique({
      where: { sessionId: id },
      include: { session: true },
    })

    if (!feedback || feedback.session.userId !== userId) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 })
    }

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Get feedback error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
