import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json([
    { type: 'BEHAVIORAL', label: 'Behavioral', description: 'Practice STAR method and situational questions' },
    { type: 'TECHNICAL', label: 'Technical', description: 'Technical knowledge, coding, and problem-solving' },
    { type: 'SYSTEM_DESIGN', label: 'System Design', description: 'Design scalable systems and architecture' },
    { type: 'HR_CULTURE_FIT', label: 'HR & Culture Fit', description: 'Values, motivation, and team fit' },
  ])
}
