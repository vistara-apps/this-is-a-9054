import React, { useState, useRef, useEffect } from 'react'
import { Video, Square, Play, Pause, Download, Share, Lock } from 'lucide-react'
import InfoCard from '../components/InfoCard'
import CallToActionButton from '../components/CallToActionButton'

const RecordingView = ({ user, setUser }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordings, setRecordings] = useState([])
  const [currentRecording, setCurrentRecording] = useState(null)
  
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      streamRef.current = stream
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const timestamp = new Date().toISOString()
        
        const newRecording = {
          id: Date.now(),
          url,
          blob,
          timestamp,
          duration: recordingTime,
          location: user.location
        }
        
        setRecordings(prev => [newRecording, ...prev])
        setCurrentRecording(newRecording)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to access camera/microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      streamRef.current.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setIsPaused(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1)
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        clearInterval(timerRef.current)
      }
      setIsPaused(!isPaused)
    }
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const downloadRecording = (recording) => {
    const a = document.createElement('a')
    a.href = recording.url
    a.download = `guardian-guide-recording-${recording.timestamp}.webm`
    a.click()
  }

  const shareRecording = async (recording) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Guardian Guide Recording',
          text: `Incident recorded on ${new Date(recording.timestamp).toLocaleString()}`,
          url: recording.url
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(recording.url)
      alert('Recording link copied to clipboard')
    }
  }

  const maxRecordings = user.subscriptionStatus === 'premium' ? Infinity : 3

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <InfoCard
        variant="stateGuide"
        title="One-Tap Recording"
        content={
          <div className="space-y-6">
            <p className="text-white/80">
              Start recording instantly. Audio and video will be saved with timestamp and location.
            </p>
            
            {/* Recording Status */}
            <div className="flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  isRecording 
                    ? (isPaused ? 'bg-yellow-600' : 'bg-red-600 animate-pulse') 
                    : 'bg-white/20'
                }`}>
                  <Video className="h-8 w-8 text-white" />
                </div>
                <div className="text-white font-mono text-xl">
                  {formatTime(recordingTime)}
                </div>
                {isRecording && (
                  <div className="text-accent text-sm">
                    {isPaused ? 'PAUSED' : 'RECORDING'}
                  </div>
                )}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              {!isRecording ? (
                <CallToActionButton
                  variant="record"
                  onClick={startRecording}
                  className="text-lg px-8 py-4"
                >
                  <Video className="h-6 w-6" />
                  <span>Start Recording</span>
                </CallToActionButton>
              ) : (
                <div className="flex space-x-3">
                  <CallToActionButton
                    variant={isPaused ? 'accent' : 'alert'}
                    onClick={pauseRecording}
                  >
                    {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </CallToActionButton>
                  
                  <CallToActionButton
                    variant="record"
                    onClick={stopRecording}
                  >
                    <Square className="h-5 w-5" />
                    <span>Stop</span>
                  </CallToActionButton>
                </div>
              )}
            </div>
          </div>
        }
        icon={Video}
      />

      {/* Storage Limit Warning */}
      {user.subscriptionStatus === 'free' && recordings.length >= maxRecordings && (
        <InfoCard
          variant="premium"
          title="Storage Limit Reached"
          content={
            <div className="space-y-3">
              <p className="text-white/80">
                Free accounts can store up to {maxRecordings} recordings. Upgrade to Premium for unlimited storage.
              </p>
              <CallToActionButton
                variant="premium"
                onClick={() => setUser(prev => ({ ...prev, subscriptionStatus: 'premium' }))}
              >
                Upgrade to Premium
              </CallToActionButton>
            </div>
          }
        />
      )}

      {/* Recordings List */}
      <InfoCard
        title={`Your Recordings (${recordings.length}${user.subscriptionStatus === 'free' ? `/${maxRecordings}` : ''})`}
        content={
          <div className="space-y-4">
            {recordings.length === 0 ? (
              <p className="text-white/60 text-center py-8">
                No recordings yet. Tap "Start Recording" to begin.
              </p>
            ) : (
              recordings.slice(0, user.subscriptionStatus === 'premium' ? undefined : maxRecordings).map((recording) => (
                <div key={recording.id} className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">
                        {new Date(recording.timestamp).toLocaleDateString()} at {new Date(recording.timestamp).toLocaleTimeString()}
                      </h4>
                      <p className="text-white/60 text-sm">
                        Duration: {formatTime(recording.duration)}
                      </p>
                    </div>
                  </div>
                  
                  <video 
                    src={recording.url} 
                    controls 
                    className="w-full rounded max-h-48"
                  />
                  
                  <div className="flex space-x-2">
                    <CallToActionButton
                      variant="default"
                      onClick={() => downloadRecording(recording)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </CallToActionButton>
                    
                    <CallToActionButton
                      variant="share"
                      onClick={() => shareRecording(recording)}
                      className="flex-1"
                    >
                      <Share className="h-4 w-4" />
                      <span>Share</span>
                    </CallToActionButton>
                  </div>
                </div>
              ))
            )}
          </div>
        }
      />

      {/* Recording Tips */}
      <InfoCard
        title="Recording Tips"
        content={
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <p className="text-white/80">Hold your phone steady and keep it visible</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <p className="text-white/80">Announce that you are recording for legal documentation</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <p className="text-white/80">Stay at a safe distance and don't interfere</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <p className="text-white/80">Recordings include GPS location and timestamp automatically</p>
            </div>
          </div>
        }
      />
    </div>
  )
}

export default RecordingView