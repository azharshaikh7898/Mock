import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const TurnSchema = z.object({
  transcript: z.string().min(1)
})

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

    const body = await request.json()
    const { transcript } = TurnSchema.parse(body)

    const session = await prisma.interviewSession.findUnique({
      where: { id, userId },
      include: { turns: { orderBy: { createdAt: 'asc' } }, user: { include: { profile: true } } },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Save candidate's turn
    await prisma.interviewTurn.create({
      data: {
        sessionId: session.id,
        speaker: 'CANDIDATE',
        transcript,
      },
    })

    // Generate next interviewer response (simplified for demo)
    // In real implementation, this would use OpenAI/LangGraph to evaluate and generate next question
    let nextQuestion = ''
    const turnCount = session.turns.length + 1

    if (turnCount >= 10) {
      nextQuestion = "Thank you for your time today! That's all the questions I have for you. Is there anything you'd like to ask me before we wrap up?"
    } else {
      // Simple follow-up logic based on interview type
      switch (session.interviewType) {
        case 'BEHAVIORAL':
          nextQuestion = "That's interesting. Can you give me another example of a time you worked effectively in a team?"
          break
        case 'TECHNICAL':
          nextQuestion = "Great! Now let's talk about a time you had to debug a complex issue. How did you approach it?"
          break
        case 'SYSTEM_DESIGN':
          nextQuestion = "Good. Now, how would you handle scaling this system to 10 million users?"
          break
        case 'HR_CULTURE_FIT':
          nextQuestion = "Thanks for sharing. Tell me about a time you disagreed with a team member and how you resolved it?"
          break
      }
    }

    const interviewerTurn = await prisma.interviewTurn.create({
      data: {
        sessionId: session.id,
        speaker: 'INTERVIEWER',
        transcript: nextQuestion,
      },
    })

    return NextResponse.json({ message: nextQuestion, turn: interviewerTurn })
  } catch (error) {
    console.error('Turn error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
