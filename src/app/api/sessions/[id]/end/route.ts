import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

export async function POST(
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

    const session = await prisma.interviewSession.findUnique({
      where: { id, userId },
      include: { turns: true },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const endedAt = new Date()
    const durationSeconds = Math.floor((endedAt.getTime() - session.startedAt.getTime()) / 1000)

    const updatedSession = await prisma.interviewSession.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endedAt,
        durationSeconds,
        overallScore: 75, // Simplified for demo
      },
    })

    // Generate simplified feedback
    const feedback = await prisma.interviewFeedback.create({
      data: {
        sessionId: session.id,
        strengths: ['Good communication skills', 'Clear responses'],
        weaknesses: ['Could use more specific examples', 'Needs more depth'],
        followUpQuality: 80,
        structureScore: 70,
        depthScore: 75,
        communicationScore: 85,
        recommendation: 'Practice providing more specific examples with metrics',
        reportJson: {},
      },
    })

    return NextResponse.json({ session: updatedSession, feedback })
  } catch (error) {
    console.error('End session error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
