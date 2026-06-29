import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { signToken } from '@/lib/jwt'
import { z } from 'zod'

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = SignupSchema.parse(body)

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    })

    const token = signToken({ userId: user.id })

    return NextResponse.json({ token, user: { id: user.id, email: user.email } })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
