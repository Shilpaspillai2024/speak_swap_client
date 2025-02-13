'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useBookingStore } from '@/store/bookingStore'
import socketStore from '@/store/socketStore'
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Users } from 'lucide-react'



const ClassRoom = () => {
  const { bookingId } = useParams()
  const [error, setError] = useState('')
  const [isSessionReady, setIsSessionReady] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [participantCount, setParticipantCount] = useState(1)
  const [remoteUserJoined, setRemoteUserJoined] = useState(false)

  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const localStream = useRef<MediaStream | null>(null)
  const isInitiator = useRef<boolean>(false)

  console.log("isInitator",isInitiator)

  const { bookingDetails } = useBookingStore()
  const socket = socketStore.getState().socket

  console.log('[ClassRoom] Initial render with bookingId:', bookingId)
  console.log('[ClassRoom] Booking details:', bookingDetails)

 useEffect(() => {
    if (!bookingDetails?.selectedDate || !bookingDetails?.selectedSlot?.startTime) {
      console.error('[ClassRoom] Missing booking details:', {
        selectedDate: bookingDetails?.selectedDate,
        startTime: bookingDetails?.selectedSlot?.startTime
      })
      setError('Invalid booking details')
      return
    }
  }, [bookingDetails])

  useEffect(() => {
    if (bookingDetails?.userRole === 'tutor') {
      isInitiator.current = true;
    } else {
      isInitiator.current = false;
    }
    console.log("User role:", bookingDetails?.userRole, "isInitiator:", isInitiator.current);
  }, [bookingDetails?.userRole]);
  
  const toggleAudio = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach(track => track.enabled = !isAudioEnabled)
      setIsAudioEnabled(!isAudioEnabled)
    }
  }

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach(track => track.enabled = !isVideoEnabled)
      setIsVideoEnabled(!isVideoEnabled)
    }
  }

  
  const initializePeerConnection = async () => {

   
    try {

        console.log("iniatilize peer connection")
      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }

      // Close existing peer connection if it exists
    if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }

      peerConnection.current = new RTCPeerConnection(configuration)

     
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      localStream.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

    
      stream.getTracks().forEach(track => {
        if (peerConnection.current) {
          peerConnection.current.addTrack(track, stream)
        }
      })
     
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sending ICE candidate")
          socket?.emit('candidate', { 
            candidate: event.candidate, 
            bookingId 
          })
        }
      }

      peerConnection.current.ontrack = (event) => {
        console.log("Received remote track",event.streams)
       
        if (event.streams && event.streams[0]) {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0]; 
            }
            setParticipantCount(2);
          }
      }

      peerConnection.current.oniceconnectionstatechange = () => {
        console.log("ICE Connection State:", peerConnection.current?.iceConnectionState)
      }

    } catch (err) {
      console.error("Error in initializePeerConnection:", err)
      setError('Could not access camera/microphone. Please check permissions.')
    }
  }

  const createAndSendOffer = async () => {
    try {
      if (!peerConnection.current) {
        console.error("No peer connection when trying to create offer")
        return
      }



      if (peerConnection.current.signalingState !== "stable") {
        console.warn("Cannot create offer in non-stable state:", peerConnection.current.signalingState);
        return;
      }
      const offer = await peerConnection.current.createOffer()
      await peerConnection.current.setLocalDescription(offer)
      
      console.log("Sending offer to remote peer")
      socket?.emit('offer', { 
        offer, 
        bookingId 
      })
    } catch (err) {
      console.error("Error creating/sending offer:", err)
      setError('Failed to establish connection. Please try again.')
    }
  }



  useEffect(() => {
    if (!socket || !bookingDetails?.userRole) return;
  
    console.log(`[ClassRoom] Emitting joinSession for bookingId: ${bookingId}`);

  
  socket.emit('joinSession', { bookingId:bookingDetails.bookingId, userRole: bookingDetails.userRole });
  
    socket.on('sessionInfo', () => {
      console.log("Session is ready");
      setIsSessionReady(true);
    });
  
    socket.on('sessionError', (message: string) => {
      console.error("Session error:", message);
      setError(message);
    });
  
    socket.on('userJoinedSession', async ({ userRole }) => {
      console.log("Remote user joined:", userRole);
      setRemoteUserJoined(true);
  
      // Only the tutor (initiator) creates and sends an offer
      if (isInitiator.current) {
        console.log("eneted in istitaitor",isInitiator.current)
        await initializePeerConnection();
        await createAndSendOffer();
      }
    });
 
socket.on('receivevideoOffer', async ({ offer }) => {
    console.log("Received offer");
    if (!peerConnection.current) {
      await initializePeerConnection();
    }
  
    if (peerConnection.current?.signalingState === "stable" || peerConnection.current?.signalingState === "have-local-offer") {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
  
      // ✅ Add any queued ICE candidates
      while (iceCandidatesQueue.current.length > 0) {
        const candidate = iceCandidatesQueue.current.shift();
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
  
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      
      socket.emit('answer', { answer, bookingId });
    }
  });
  
  socket.on('receivevideoAnswer', async ({ answer }) => {
    console.log("Received answer");
    if (!peerConnection.current) {
      console.error("PeerConnection is not initialized yet");
      return;
    }
  
    if (peerConnection.current?.signalingState !== "stable") {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
  
      // ✅ Add any queued ICE candidates
      while (iceCandidatesQueue.current.length > 0) {
        const candidate = iceCandidatesQueue.current.shift();
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    }
  });


    socket.on('candidate', async ({ candidate }) => {
        try {
          if (peerConnection.current?.remoteDescription) {
            console.log("✅ Adding ICE Candidate", candidate);
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            console.warn("⚠️ Remote description not set yet, queuing candidate...");
            iceCandidatesQueue.current.push(candidate);
          }
        } catch (err) {
          console.error("❌ Error adding ICE candidate:", err);
        }
      });


   
  
    return () => {
     
      socket.off('sessionInfo');
      socket.off('sessionError');
      socket.off('userJoinedSession');
      socket.off('receivevideoOffer');
      socket.off('receivevideoAnswer');
      socket.off('candidate');
    };
  }, [socket, bookingId, bookingDetails?.userRole]);
  

  const endCall = () => {
    localStream.current?.getTracks().forEach(track => track.stop())
    peerConnection.current?.close()
    socket?.emit('endSession', { bookingId })
    window.location.href = bookingDetails?.userRole === 'tutor' ? '/tutor/dashboard' : '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Virtual Classroom</h1>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-700 px-3 py-1 rounded-lg">
                <Users className="w-4 h-4 text-gray-300 mr-2" />
                <span className="text-gray-300">{participantCount}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full rounded-lg bg-gray-700 aspect-video object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <p className="text-white bg-gray-900/70 px-3 py-1 rounded-lg">You</p>
              </div>
            </div>

            <div className="relative">
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full rounded-lg bg-gray-700 aspect-video object-cover" 
              />
              <div className="absolute bottom-4 left-4">
                <p className="text-white bg-gray-900/70 px-3 py-1 rounded-lg">Remote User</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full ${isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {isAudioEnabled ? (
                <Mic className="w-6 h-6 text-white" />
              ) : (
                <MicOff className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {isVideoEnabled ? (
                <VideoIcon className="w-6 h-6 text-white" />
              ) : (
                <VideoOff className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClassRoom