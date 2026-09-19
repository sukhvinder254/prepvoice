
# PrepVoice

An AI-powered voice-based interview preparation tool. Users speak their answer to a common interview question and receive instant AI-generated feedback, including a score, strengths, and areas for improvement.

## Overview

PrepVoice helps job seekers practice answering interview questions out loud rather than reading or typing responses. The application listens to a spoken answer, transcribes it in real time, and uses an AI model to evaluate the quality of the response, simulating the experience of a real interview coach.

## Features

- Real-time voice recording through the browser microphone
- Live speech-to-text transcription
- AI-powered evaluation of interview answers
- Instant feedback with a numeric score, strengths, and improvement suggestions

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend and Backend | Next.js 16 (App Router, TypeScript) |
| Speech-to-Text | Web Speech API |
| AI Evaluation | Google Gemini API (gemini-2.5-flash) |
| Styling | Inline styles (Tailwind CSS integration planned) |

## Project Status

This project is under active development as a hands-on exercise in full-stack development and AI integration.

**Completed:**
- Microphone access and audio recording
- Live speech-to-text transcription
- Backend API route for AI evaluation
- Feedback rendered on the UI, including score, strengths, and improvements

**Planned:**
- Text-to-speech playback of AI feedback
- MongoDB integration for saving attempt history
- UI redesign using Tailwind CSS
- A rotating bank of interview questions
- Deployment on Vercel

## Getting Started

### Prerequisites

- Node.js version 18.18 or later
- A Google Gemini API key, available at https://aistudio.google.com/apikey

### Installation

1. Clone the repository:
   ```

   git clone https://github.com/YOUR_USERNAME/prepvoice.git
   cd prepvoice
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the project root and add your API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open http://localhost:3000 in Google Chrome. The Speech Recognition API is most reliable in Chrome and Edge.

## Notes

- Speech Recognition requires an active internet connection, as it relies on cloud-based processing.
- The application should be tested in an actual browser window rather than an embedded preview, as some environments do not support microphone access correctly.
- Certain restrictive networks, such as institutional Wi-Fi, may block the Speech Recognition API.

## Project Structure

```

prepvoice/
├── app/
│   ├── api/
│   │   └── evaluate/
│   │       └── route.ts     (Backend route that calls the Gemini API)
│   ├── page.tsx              (Main UI: recording, transcript, and feedback)
│   └── layout.tsx
├── .env.local                (Environment variables, not committed to version control)
└── package.json
```

## License

This project was built for personal learning and portfolio purposes.