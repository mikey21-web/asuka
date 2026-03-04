'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface VoiceInputProps {
  onTranscription: (text: string) => void
  isChatLoading: boolean
}

export default function VoiceInput({ onTranscription, isChatLoading }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recog = new SpeechRecognition()
        recog.continuous = false
        recog.interimResults = false
        recog.lang = 'en-IN'

        recog.onstart = () => setIsListening(true)
        recog.onend   = () => setIsListening(false)
        recog.onerror = () => setIsListening(false)
        recog.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          if (transcript) onTranscription(transcript)
        }
        setRecognition(recog)
      }
    }
  }, [onTranscription])

  const toggleListening = useCallback(() => {
    if (!recognition || isChatLoading) return
    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }, [recognition, isListening, isChatLoading])

  if (!recognition) return null

  return (
    <button
      onClick={toggleListening}
      disabled={isChatLoading}
      title={isListening ? 'Stop listening' : 'Speak your message'}
      style={{
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: isListening ? '#c0392b' : '#a17a58',
        border: 'none',
        cursor: isChatLoading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        opacity: isChatLoading ? 0.5 : 1,
        transition: 'all 0.2s',
        boxShadow: isListening
          ? '0 0 0 4px rgba(192,57,43,0.25)'
          : '0 2px 8px rgba(139,94,60,0.35)',
        flexShrink: 0,
      }}
    >
      {/* Pulse ring when listening */}
      {isListening && (
        <span style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'rgba(192,57,43,0.4)',
          animation: 'pulse 1.2s ease-out infinite',
        }} />
      )}

      {/* Mic icon — white stroke, always visible on brown background */}
      <svg
        width="16" height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8"  y1="23" x2="16" y2="23"/>
      </svg>

      <style>{`
        @keyframes pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </button>
  )
}
