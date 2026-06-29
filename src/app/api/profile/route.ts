import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { z } from 'zod'

const ProfileSchema = z.object({
  name: z.string().min(1),
  targetRole: z.string().min(1),
  experienceLevel: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { userId } = verifyToken(token)

    const body = await request.json()
    const { name, targetRole, experienceLevel } = ProfileSchema.parse(body)

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: { name, targetRole, experienceLevel },
      create: { userId, name, targetRole, experienceLevel },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
