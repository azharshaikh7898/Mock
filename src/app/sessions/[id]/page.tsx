'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Feedback {
  strengths: string[]
  weaknesses: string[]
  followUpQuality: number
  structureScore: number
  depthScore: number
  communicationScore: number
  recommendation: string
}

interface Session {
  id: string
  interviewType: string
  overallScore: number
  feedback: Feedback
}

export default function SessionFeedback() {
  const { user, token, loading } = useAuth()
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()
  const params = useParams()

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch(`/api/sessions/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setSession(data)
      }
    } catch (error) {
      console.error('Fetch session error:', error)
    }
  }, [params.id, token])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchSession()
    }
  }, [user, loading, router, fetchSession])

  const getInterviewTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      BEHAVIORAL: 'Behavioral',
      TECHNICAL: 'Technical',
      SYSTEM_DESIGN: 'System Design',
      HR_CULTURE_FIT: 'HR & Culture Fit',
    }
    return labels[type] || type
  }

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">AI Interview</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Feedback</h1>
          <p className="text-gray-600 mb-8">{getInterviewTypeLabel(session.interviewType)}</p>

          <div className="mb-8 text-center">
            <div className="text-6xl font-bold text-indigo-600">{session.overallScore}%</div>
            <div className="text-lg text-gray-600 mt-2">Overall Score</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-600">{session.feedback.structureScore}%</div>
              <div className="text-sm text-gray-600">Structure</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-600">{session.feedback.depthScore}%</div>
              <div className="text-sm text-gray-600">Depth</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-600">{session.feedback.communicationScore}%</div>
              <div className="text-sm text-gray-600">Communication</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Strengths</h3>
            <ul className="space-y-2">
              {session.feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Areas to Improve</h3>
            <ul className="space-y-2">
              {session.feedback.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Recommendation</h3>
            <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg">{session.feedback.recommendation}</p>
          </div>

          <Link
            href="/dashboard"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
