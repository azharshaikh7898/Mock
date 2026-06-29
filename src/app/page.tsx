'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (user) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold text-gray-900">AI Interview</div>
            <div className="flex space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2">Login</Link>
              <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Ace Your Next Interview</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Practice with AI-powered mock interviews tailored to your role and experience level.
            Get real-time feedback and improve your interview skills.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup" className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700">
              Get Started
            </Link>
            <Link href="/login" className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50">
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Voice-Only Experience</h3>
            <p className="text-gray-600">Practice with natural voice conversations, just like a real interview.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Feedback</h3>
            <p className="text-gray-600">Get detailed feedback on your performance and areas to improve.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Multiple Interview Types</h3>
            <p className="text-gray-600">Choose from behavioral, technical, system design, and HR interviews.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
