import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

export const signToken = (payload: { userId: string }) => {
  return (jwt.sign as any)(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  return (jwt.verify as any)(token, JWT_SECRET) as { userId: string }
}
