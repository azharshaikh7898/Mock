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
      include: { user: { include: { profile: true } } },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const profile = session.user.profile
    let openingMessage = ''

    switch (session.interviewType) {
      case 'BEHAVIORAL':
        openingMessage = `Hello ${profile?.name || 'there'}! I'm your AI behavioral interviewer today. We'll be talking about your past experiences, how you handle situations, and real-world examples. Let's start by telling me about a time you overcame a significant challenge at work.`
        break
      case 'TECHNICAL':
        openingMessage = `Hi ${profile?.name || 'there'}! Welcome to your technical interview. Let's dive right in. Can you walk me through a technical project you're particularly proud of, and what you learned from it?`
        break
      case 'SYSTEM_DESIGN':
        openingMessage = `Hello ${profile?.name || 'there'}! Let's talk system design. Imagine you're building a URL shortener like bit.ly. Walk me through how you'd approach designing this system.`
        break
      case 'HR_CULTURE_FIT':
        openingMessage = `Hi ${profile?.name || 'there'}! Great to meet you. Let's start by getting to know each other better. What motivates you in your career, and what are you looking for in your next role?`
        break
    }

    const turn = await prisma.interviewTurn.create({
      data: {
        sessionId: session.id,
        speaker: 'INTERVIEWER',
        transcript: openingMessage,
      },
    })

    return NextResponse.json({ message: openingMessage, turn })
  } catch (error) {
    console.error('Start session error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
