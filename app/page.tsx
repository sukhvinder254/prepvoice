/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleStart = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Try Chrome.");
      return;
    }

    setFeedback(null);
    setTranscript("");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const handleStop = async () => {
    recognitionRef.current?.stop();
    setIsRecording(false);

    if (!transcript || transcript.trim().length === 0) {
      alert("Kuch bola nahi gaya. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: transcript }),
      });
      const data = await res.json();
      setFeedback(data);
      speakFeedback(data);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      alert("Feedback nahi mil paya. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const speakFeedback = (data: any) => {
    if (!("speechSynthesis" in window)) return;
    const text = `Your score is ${data.score} out of 10. Strengths: ${data.strengths}. Improvements: ${data.improvements}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const circumference = 264;
  const scoreOffset = feedback
    ? circumference - (feedback.score / 10) * circumference
    : circumference;

  return (
    <main className="min-h-screen bg-[#14161C] text-[#F2F0EA] font-['Inter'] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="font-['Fraunces'] text-4xl font-medium tracking-tight">PrepVoice</h1>
          <p className="mt-2 text-sm text-[#9A9CAA]">
            Practice out loud. Get coached like it&apos;s the real thing.
          </p>
        </div>

        {/* Question */}
        <div className="border-t border-[#2A2E3A] pt-6">
          <p className="text-xs text-[#6E7180] mb-1">Today&apos;s question</p>
          <p className="font-['Fraunces'] text-xl italic">Tell me about yourself.</p>
        </div>

        {/* Mic button */}
        <div className="flex flex-col items-center py-10 border-t border-[#2A2E3A] mt-6">
          <button
            onClick={isRecording ? handleStop : handleStart}
            className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 ${
              isRecording
                ? "bg-[#E8A33D]"
                : "bg-[#1D2029] border border-[#2A2E3A] hover:border-[#E8A33D]/60"
            }`}
          >
            {isRecording ? (
              <div className="flex items-end gap-1 h-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="waveform-bar w-1 h-full bg-[#14161C] rounded-full"
                  ></span>
                ))}
              </div>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E8A33D" strokeWidth="1.6">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10v1a7 7 0 0 0 14 0v-1" strokeLinecap="round" />
                <path d="M12 18v3" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <p className="mt-4 text-xs text-[#6E7180]">
            {isRecording ? "Listening — tap to stop" : "Tap to speak"}
          </p>
        </div>

        {/* Transcript */}
        <div className="border-t border-[#2A2E3A] pt-6">
          <p className="text-xs text-[#6E7180] mb-2">Your answer</p>
          <p className="text-sm leading-relaxed text-[#C7C9D1] min-h-[40px]">
            {transcript || (
              <span className="text-[#4B4E5C] italic">Nothing yet — start speaking above.</span>
            )}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="border-t border-[#2A2E3A] pt-6 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8A33D] animate-ping"></span>
            <span className="text-sm text-[#E8A33D]">Coach is thinking...</span>
          </div>
        )}

        {/* Feedback */}
        {feedback && !loading && (
          <div className="border-t border-[#2A2E3A] pt-6">
            <div className="flex items-center gap-5 mb-6">
              <div className="relative h-[100px] w-[100px] shrink-0">
                <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
                  <circle cx="50" cy="50" r="42" stroke="#2A2E3A" strokeWidth="7" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#E8A33D"
                    strokeWidth="7"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={scoreOffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-['Fraunces'] text-2xl">{feedback.score}</span>
                  <span className="text-[10px] text-[#6E7180]">out of 10</span>
                </div>
              </div>
              <div>
                <p className="font-['Fraunces'] text-lg">Coach&apos;s notes</p>
                <p className="text-xs text-[#6E7180]">Based on your spoken answer</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#5FBFA0] mb-1">What worked</p>
                <p className="text-sm text-[#C7C9D1] leading-relaxed">{feedback.strengths}</p>
              </div>
              <div>
                <p className="text-xs text-[#E8A33D] mb-1">Work on this next</p>
                <p className="text-sm text-[#C7C9D1] leading-relaxed">{feedback.improvements}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
