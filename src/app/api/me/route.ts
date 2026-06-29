import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { userId } = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      profile: user.profile,
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
