'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'

interface Turn {
  id: string
  speaker: string
  transcript: string
  createdAt: string
}

interface Session {
  id: string
  interviewType: string
  turns: Turn[]
}

// Minimal type declarations for browser speech APIs
interface SpeechRecognitionEvent extends Event {
  results: any
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

// Add type declarations to global window
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function Interview() {
  const { user, token, loading } = useAuth()
  const [session, setSession] = useState<Session | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [processing, setProcessing] = useState(false)
  const router = useRouter()
  const params = useParams()
  const recognitionRef = useRef<any>(null)

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

  const initSession = useCallback(async () => {
    try {
      const response = await fetch(`/api/sessions/${params.id}/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentMessage(data.message)
        // Speak the message
        speak(data.message)
        fetchSession()
      }
    } catch (error) {
      console.error('Init session error:', error)
    }
  }, [params.id, token, fetchSession])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      initSession()
    }
  }, [user, loading, router, initSession])

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript
        handleTranscript(transcript)
      }

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current.start()
      setIsRecording(true)
    } else {
      alert('Speech recognition not supported in your browser')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
  }

  const handleTranscript = async (transcript: string) => {
    setProcessing(true)
    try {
      const response = await fetch(`/api/sessions/${params.id}/turn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transcript }),
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentMessage(data.message)
        speak(data.message)
        fetchSession()
      }
    } catch (error) {
      console.error('Send turn error:', error)
    } finally {
      setProcessing(false)
    }
  }

  const endSession = async () => {
    try {
      await fetch(`/api/sessions/${params.id}/end`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      router.push(`/sessions/${params.id}`)
    } catch (error) {
      console.error('End session error:', error)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold text-gray-900">AI Interview</div>
            <button
              onClick={endSession}
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              End Interview
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-lg font-semibold text-gray-700 mb-4">Interview in Progress</div>
            <div className="text-xl text-gray-900 min-h-[80px]">
              {processing ? 'Processing...' : currentMessage}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={processing}
                className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🎤 Start Speaking
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-700 animate-pulse"
              >
                🔴 Recording...
              </button>
            )}
          </div>

          <div className="mt-8 max-h-64 overflow-y-auto">
            {session?.turns.map((turn) => (
              <div
                key={turn.id}
                className={`mb-3 p-3 rounded-lg ${
                  turn.speaker === 'INTERVIEWER'
                    ? 'bg-blue-50 text-blue-900'
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {turn.speaker === 'INTERVIEWER' ? 'Interviewer' : 'You'}
                </div>
                <div className="text-sm">{turn.transcript}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
