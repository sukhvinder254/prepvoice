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
      const speakFeedback = (data: any) => {
    if (!("speechSynthesis" in window)) {
      console.error("Text-to-speech not supported in this browser.");
      return;
    }

    const text = `Your score is ${data.score} out of 10. Strengths: ${data.strengths}. Improvements: ${data.improvements}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };
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

  return (
    <main style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>PrepVoice</h1>
      <p>Tell me about yourself.</p>
      <button onClick={isRecording ? handleStop : handleStart}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <strong>Transcript:</strong>
        <p>{transcript || "Bolna shuru karo..."}</p>
      </div>

      {loading && <p>Analyzing your answer...</p>}

      {feedback && !loading && (
        <div style={{ marginTop: "20px", padding: "16px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Feedback</h3>
          <p><strong>Score:</strong> {feedback.score}/10</p>
          <p><strong>Strengths:</strong> {feedback.strengths}</p>
          <p><strong>Improvements:</strong> {feedback.improvements}</p>
        </div>
      )}
    </main>
  );
}
