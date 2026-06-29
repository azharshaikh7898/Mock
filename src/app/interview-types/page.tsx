'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface InterviewType {
  type: string
  label: string
  description: string
}

export default function InterviewTypes() {
  const { user, token, loading } = useAuth()
  const [interviewTypes, setInterviewTypes] = useState<InterviewType[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else {
      fetchInterviewTypes()
    }
  }, [user, loading, router])

  const fetchInterviewTypes = async () => {
    try {
      const response = await fetch('/api/interview-types')
      if (response.ok) {
        const data = await response.json()
        setInterviewTypes(data)
      }
    } catch (error) {
      console.error('Fetch interview types error:', error)
    }
  }

  const startInterview = async (interviewType: string) => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interviewType }),
      })

      if (response.ok) {
        const session = await response.json()
        router.push(`/interview/${session.id}`)
      }
    } catch (error) {
      console.error('Start interview error:', error)
    }
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
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Interview Type</h1>
        <p className="text-gray-600">Select the type of interview you would like to practice</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviewTypes.map((type) => (
            <div
              key={type.type}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => startInterview(type.type)}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{type.label}</h2>
              <p className="text-gray-600">{type.description}</p>
              <button className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                Start Interview
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
