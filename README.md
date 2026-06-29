# AI Mock Interview Platform

A production-quality AI-powered mock interview platform with voice-only conversations, adaptive questioning, and detailed feedback reports.

## Features

- **User Authentication**: Sign up, login, and logout with JWT
- **Profile Management**: Create and update your candidate profile
- **Multiple Interview Types**:
  - Behavioral interviews (STAR method)
  - Technical interviews
  - System Design interviews
  - HR & Culture Fit interviews
- **Voice-Only Experience**: Natural speech-to-text and text-to-speech conversation
- **Adaptive Questioning**: Next question depends on your previous answers
- **Detailed Feedback Reports**: Per-skill scores, strengths, weaknesses, and recommendations
- **Interview History**: View past interviews and feedback

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT
- **Voice**: Browser Web Speech API (speech recognition and synthesis)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Local Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and fill in your database URL and JWT secret
   ```

3. **Set up database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_interview_platform?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# OpenAI (optional, for enhanced AI)
OPENAI_API_KEY="your-openai-api-key"
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── interview-types/
│   │   ├── me/
│   │   ├── profile/
│   │   └── sessions/
│   ├── dashboard/
│   ├── interview/
│   ├── interview-types/
│   ├── login/
│   ├── profile/
│   ├── sessions/
│   ├── signup/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── contexts/
│   └── AuthContext.tsx
└── lib/
    ├── prisma.ts
    └── jwt.ts
prisma/
└── schema.prisma
```

## Demo Script

### End-to-End Interview Experience

1. **Sign Up**: Create a new account with your email and password
2. **Complete Profile**: Enter your name, target role, and experience level
3. **Choose Interview Type**: Select from Behavioral, Technical, System Design, or HR & Culture Fit
4. **Start Interview**:
   - The AI interviewer will greet you and ask the first question
   - Click "Start Speaking" to answer using your microphone
   - The AI will evaluate your answer and ask a follow-up question
5. **End Interview**: Click "End Interview" when you're done
6. **View Feedback**: See your scores, strengths, and areas to improve

## Voice Integration

This demo uses the browser's built-in Web Speech API for:
- **Speech Recognition**: Converts your voice to text
- **Speech Synthesis**: Converts AI responses to audio

For production use with higher quality voice, you could integrate:
- OpenAI Realtime API
- ElevenLabs Conversational AI
- Retell AI

## Cost Analysis

### Browser Web Speech API (Current)
- **Cost**: Free!
- **Pros**: No API keys needed, works offline, unlimited usage
- **Cons**: Voice quality varies by browser, limited customization

### OpenAI Realtime API (Optional Upgrade)
- **Cost**: ~$0.006 per minute of audio (input + output)
- **Pros**: High-quality voice, low latency, good naturalness
- **Cons**: Requires API key, costs add up with usage

### ElevenLabs Conversational AI (Optional Upgrade)
- **Cost**: ~$0.005 per minute
- **Pros**: Extremely natural voices, wide voice selection
- **Cons**: Higher cost at scale

## Future Enhancements

- Integrate OpenAI/LangGraph for truly adaptive, stateful conversation
- Add real-time whisper transcription for better accuracy
- Implement more sophisticated evaluation metrics
- Add video recording option
- Support for longer interviews
- Interview practice question bank

## License

MIT
