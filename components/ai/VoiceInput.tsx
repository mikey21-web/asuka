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
      console.log('VoiceInput: Stopping manually')
      try { recog.stop() } catch (e) { console.error(e) }
    } else {
      setErrorStatus(null)
      setInterimText('')
      try {
        console.log('VoiceInput: Starting...')
        recog.start()
      } catch (e) {
        console.warn('VoiceInput: Start failed, attempting abort and restart')
        try {
          recog.abort()
          setTimeout(() => recog.start(), 300)
        } catch (err) {
          console.error('VoiceInput: Critical start error', err)
          setErrorStatus('start-failed')
        }
      }
    }
  }, [isListening, isChatLoading])

  if (!recognition && !errorStatus) return null

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {(errorStatus || (isListening && interimText)) && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          marginBottom: '10px',
          background: '#1a1410',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 100,
          pointerEvents: 'none',
          animation: 'fadeUp 0.3s ease',
          maxWidth: '220px',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {errorStatus ? (
            errorStatus === 'not-allowed' ? '⚠️ MIC ACCESS DENIED' :
              errorStatus === 'no-speech' ? 'TRY SPEAKING LOUDER...' :
                `ERROR: ${errorStatus.toUpperCase()}`
          ) : (
            `Hearing: "${interimText}..."`
          )}
          <div style={{ position: 'absolute', top: '100%', right: '14px', border: '6px solid transparent', borderTopColor: '#1a1410' }} />
        </div>
      )}

      <button
        onClick={toggleListening}
        disabled={isChatLoading || errorStatus === 'not-supported'}
        type="button"
        title={isListening ? 'Stop listening' : 'Speak your message'}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: isListening ? '#c0392b' : (errorStatus ? '#666' : '#a17a58'),
          border: 'none',
          cursor: (isChatLoading || errorStatus === 'not-supported') ? 'not-allowed' : 'pointer',
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
          <span className="animate-ping" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'rgba(192,57,43,0.4)',
          }} />
        )}

        {/* Mic icon — white stroke, always visible */}
        <svg
          width="16" height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: 'relative', zIndex: 1, opacity: errorStatus === 'not-supported' ? 0.3 : 1 }}
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>

        {errorStatus && errorStatus !== 'no-speech' && (
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '14px',
            height: '14px',
            background: '#c0392b',
            color: 'white',
            borderRadius: '50%',
            fontSize: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            border: '1px solid white'
          }}>!</div>
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
