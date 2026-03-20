'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

interface VoiceInputProps {
  onTranscription: (text: string) => void
  isChatLoading: boolean
}

export default function VoiceInput({ onTranscription, isChatLoading }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [interimText, setInterimText] = useState('')
  const recognitionRef = useRef<any>(null)
  const onTranscriptionRef = useRef(onTranscription)
  const [errorStatus, setErrorStatus] = useState<string | null>(null)

  // Keep ref up to date
  useEffect(() => {
    onTranscriptionRef.current = onTranscription
  }, [onTranscription])

  useEffect(() => {
    if (typeof window !== 'undefined' && !recognitionRef.current) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        console.log('VoiceInput: Initializing SpeechRecognition')
        const recog = new SpeechRecognition()
        recog.continuous = false
        recog.interimResults = true
        recog.lang = window.navigator.language || 'en-IN'
        recog.maxAlternatives = 1

        recog.onstart = () => {
          console.log('VoiceInput: Recognition started')
          setIsListening(true)
          setErrorStatus(null)
          setInterimText('')
        }
        recog.onend = () => {
          console.log('VoiceInput: Recognition ended')
          setIsListening(false)
          setInterimText('')
        }
        recog.onerror = (event: any) => {
          console.error('VoiceInput Error:', event.error)
          setErrorStatus(event.error)
          setIsListening(false)
          if (event.error === 'no-speech') {
            console.warn('VoiceInput: No speech detected.')
          }
        }
        recog.onnomatch = () => {
          console.warn('VoiceInput: No match found for speech.')
          setErrorStatus('no-match')
        }
        recog.onresult = (event: any) => {
          let interim = ''
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              console.log('VoiceInput Final:', transcript)
              if (transcript) onTranscriptionRef.current(transcript)
              setInterimText('')
            } else {
              interim += transcript
            }
          }
          if (interim) setInterimText(interim)
        }
        recognitionRef.current = recog
        setRecognition(recog)
      } else {
        console.error('VoiceInput: Web Speech API not supported in this browser.')
        setErrorStatus('not-supported')
      }
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch (e) { }
      }
    }
  }, [])

  const toggleListening = useCallback(() => {
    const recog = recognitionRef.current
    if (!recog || isChatLoading) return

    if (isListening) {
      try { recog.stop() } catch (e) { }
    } else {
      setErrorStatus(null)
      setInterimText('')
      try {
        recog.start()
      } catch (e) {
        try {
          recog.abort()
          const t = setTimeout(() => {
            try { recog.start() } catch { }
          }, 400)
          return () => clearTimeout(t)
        } catch (err) {
          setErrorStatus('start-failed')
        }
      }
    }
  }, [isListening, isChatLoading])

  if (!recognition && !errorStatus) return null

  return (
    <div className="relative flex items-center">
      {(errorStatus || (isListening && interimText)) && (
        <div className="absolute bottom-full right-0 mb-3 bg-[#1a1410] text-white px-3 py-2 rounded-lg text-[10px] font-mono whitespace-nowrap shadow-xl z-[100] animate-fadeUp max-w-[200px] overflow-hidden text-ellipsis">
          {errorStatus ? (
            errorStatus === 'not-allowed' ? 'MIC ACCESS DENIED' :
              errorStatus === 'no-speech' ? 'SPEAK CLEARLY...' :
                `ERROR: ${errorStatus.toUpperCase()}`
          ) : (
            `"${interimText}..."`
          )}
          <div className="absolute top-full right-4 border-[6px] border-transparent border-t-[#1a1410]" />
        </div>
      )}

      <button
        onClick={toggleListening}
        disabled={isChatLoading || errorStatus === 'not-supported'}
        type="button"
        className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-300 relative ${isListening ? 'bg-[#c0392b] shadow-[0_0_15px_rgba(192,57,43,0.4)]' : 'bg-[#f5ede3] hover:bg-[#a17a58] text-[#a17a58] hover:text-white border border-[#d4c4b0]/50'
          } ${isChatLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={isListening ? 'Stop' : 'Voice Search'}
      >
        {isListening && (
          <span className="absolute inset-0 rounded-full animate-ping bg-[#c0392b]/30" />
        )}

        <svg
          width="18" height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="relative z-10"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>

        {errorStatus && errorStatus !== 'no-speech' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#c0392b] text-white rounded-full text-[8px] flex items-center justify-center font-bold border border-white">!</div>
        )}
      </button>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
