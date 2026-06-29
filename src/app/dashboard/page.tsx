'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Session {
  id: string
  interviewType: string
  status: string
  startedAt: string
  endedAt: string | null
  overallScore: number | null
}

export default function Dashboard() {
  const { user, token, loading, logout } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const router = useRouter()

  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch('/api/sessions', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Fetch sessions error:', error)
    }
  }, [token])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user && !user.profile) {
      router.push('/profile')
    } else if (user) {
      fetchSessions()
    }
  }, [user, loading, router, fetchSessions])

  const getInterviewTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      BEHAVIORAL: 'Behavioral',
      TECHNICAL: 'Technical',
      SYSTEM_DESIGN: 'System Design',
      HR_CULTURE_FIT: 'HR & Culture Fit',
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">AI Interview</Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.profile?.name}</span>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.profile?.name}!</h1>
          <p className="text-gray-600">Ready to practice your interview skills?</p>
        </div>

        <Link
          href="/interview-types"
          className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 mb-8"
        >
          Start New Interview
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Interviews</h2>
          {sessions.length === 0 ? (
            <p className="text-gray-600">No interviews yet. Start your first one!</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{getInterviewTypeLabel(session.interviewType)}</h3>
                      <p className="text-sm text-gray-600">{new Date(session.startedAt).toLocaleString()}</p>
                    </div>
                    {session.status === 'COMPLETED' && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-indigo-600">{session.overallScore}%</div>
                        <Link
                          href={`/sessions/${session.id}`}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          View Feedback
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
