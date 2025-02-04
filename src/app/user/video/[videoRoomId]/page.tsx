'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';
import socketStore from '@/store/socketStore';

const VideoCallPage = () => {
  const { videoRoomId } = useParams();
  console.log("🚀 [INIT] Starting VideoCallPage with roomId:", videoRoomId);

  const router = useRouter();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const iceCandidatesBuffer = useRef<RTCIceCandidate[]>([]);
  const mountedRef = useRef(false);


  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isCallConnected, setIsCallConnected] = useState(false);

  const socket = socketStore.getState().socket;
  console.log("🔌 [SOCKET] Initial socket state:", socket ? "Connected" : "Not connected");

  const isCallInitiator = sessionStorage.getItem("isCallInitiator") === "true";
  console.log("👤 [ROLE] User is call initiator:", isCallInitiator);

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  const createPeerConnection = () => {
    if (peerConnectionRef.current) {
      console.log("⚠️ [RTC] PeerConnection already exists, reusing existing connection");
      return peerConnectionRef.current;
    }

    console.log("🔨 [RTC] Creating new PeerConnection with config:", configuration);
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket && mountedRef.current) {
        console.log("🧊 [ICE] Generated new local ICE candidate:", event.candidate.candidate);
        socket.emit('sendCandidate', { 
          candidate: event.candidate, 
          videoRoomId,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("📹 [TRACK] Received remote track:", event.streams.length ? "Stream present" : "No stream");
      if (remoteVideoRef.current && event.streams[0] && mountedRef.current) {
        console.log("🎥 [TRACK] Setting remote video stream");
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };


    pc.oniceconnectionstatechange = () => {
      if (!mountedRef.current) return;
      
      if (pc.iceConnectionState === 'failed') {
        pc.restartIce();
      }
    };

    

    pc.onconnectionstatechange = () => {
      if (!mountedRef.current) return;
      console.log(`🔗 [RTC] Connection state changed to: ${pc.connectionState}`);
      setIsCallConnected(pc.connectionState === 'connected');
      
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        console.log("❌ [RTC] Connection failed or disconnected - ending call");
        handleCallEnd();
      }
    };

    pc.onnegotiationneeded = () => {
      console.log("🔄 [RTC] Negotiation needed event fired");
    };

    pc.onicegatheringstatechange = () => {
      console.log(`🧊 [ICE] Gathering state changed to: ${pc.iceGatheringState}`);
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const setupSocketListeners = () => {
    if (!socket || !mountedRef.current) {
      console.log("⚠️ [SOCKET] Cannot setup listeners - socket not connected");
      return;
    }

    console.log("🎧 [SOCKET] Setting up event listeners");
    
    // Clear existing listeners
    socket.off('callAccepted');
    socket.off('receiveOffer');
    socket.off('receiveAnswer');
    socket.off('receiveCandidate');
    socket.off('remoteDisconnect');

    socket.on('callAccepted', async () => {

      if (!mountedRef.current) return;

      console.log("📞 [CALL] Call accepted event received");
      console.log("👤 [ROLE] Call initiator status:", isCallInitiator);
      await new Promise(resolve => setTimeout(resolve, 500));
      if (isCallInitiator) {
        console.log("🎯 [CALL] Creating peer connection as initiator");
        const pc = createPeerConnection();
        
        if (localStreamRef.current) {
          console.log("🎥 [MEDIA] Adding local tracks to peer connection");
          localStreamRef.current.getTracks().forEach(track => {
            console.log(`📡 [MEDIA] Adding track: ${track.kind}`);
            
            if (mountedRef.current) {
            pc.addTrack(track, localStreamRef.current!);
            }
          });
        }
        
        await createAndSendOffer();
      }
    });

    socket.on('receiveOffer', async ({ offer }) => {

      if (!mountedRef.current) return;
      console.log("📨 [OFFER] Received offer:", offer);
      try {
        console.log("🔄 [RTC] Creating peer connection for received offer");
        const pc = createPeerConnection();
        
        if (localStreamRef.current) {
          console.log("🎥 [MEDIA] Adding local tracks to peer connection");
          localStreamRef.current.getTracks().forEach(track => {
            console.log(`📡 [MEDIA] Adding track: ${track.kind}`);
           
            if (mountedRef.current) {
            pc.addTrack(track, localStreamRef.current!);
            }
          });
        }

        console.log("📝 [OFFER] Setting remote description from offer");
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        
      


        while (iceCandidatesBuffer.current.length > 0 && mountedRef.current) {
          
          console.log(`🧊 [ICE] Processing ${iceCandidatesBuffer.current.length} bufferd candidate`)
          const candidate = iceCandidatesBuffer.current.shift();
          await pc.addIceCandidate(candidate!);
        }



        console.log("📝 [ANSWER] Creating answer");
        const answer = await pc.createAnswer();
        console.log("📝 [ANSWER] Setting local description:", answer);
        await pc.setLocalDescription(answer);
        
        console.log("📤 [ANSWER] Sending answer to peer");

        if (mountedRef.current) {
          socket.emit('sendAnswer', { answer, videoRoomId });
        }
        
      } catch (error) {
        console.error("❌ [ERROR] Error handling offer:", error);
        toast.error('Failed to process call offer');
      }
    });

    socket.on('receiveAnswer', async ({ answer }) => {

      if (!mountedRef.current) return;
      console.log("📨 [ANSWER] Received answer:", answer);
      try {
        const pc = peerConnectionRef.current;
        if (!pc) {
          console.log("⚠️ [RTC] No peer connection available for answer");
          return;
        }
        
        console.log("📝 [ANSWER] Setting remote description from answer");
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("✅ [ANSWER] Remote description set successfully");
      } catch (error) {
        console.error("❌ [ERROR] Error handling answer:", error);
        toast.error('Failed to process call answer');
      }
    });

    socket.on('receiveCandidate', async ({ candidate }) => {
      if (!mountedRef.current) return;
      console.log("🧊 [ICE] Received remote candidate:", candidate);
      try {
        const pc = peerConnectionRef.current;
        if (!pc || !pc.remoteDescription) {
          console.log("⏳ [ICE] Buffering ICE candidate - peer connection not ready");
          iceCandidatesBuffer.current.push(new RTCIceCandidate(candidate));
          return;
        }
        
        console.log("➕ [ICE] Adding remote ICE candidate");
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("✅ [ICE] Successfully added remote ICE candidate");
      } catch (error) {
        console.error("❌ [ERROR] Error handling ICE candidate:", error);
      }
    });

    socket.on('remoteDisconnect', () => {
      if (!mountedRef.current) return;
      console.log("👋 [CALL] Remote peer disconnected");
      toast.info('Other user disconnected');
      handleCallEnd();
    });
  };

  const createAndSendOffer = async () => {
    if (!mountedRef.current) return;
    const pc = peerConnectionRef.current;
    if (!pc || pc.localDescription) {
      console.log("⚠️ [OFFER] Cannot create offer - invalid state");
      return;
    }

    try {
      console.log("📝 [OFFER] Creating offer");
      const offer = await pc.createOffer();
      console.log("📝 [OFFER] Setting local description:", offer);
      await pc.setLocalDescription(offer);
      
      console.log("📤 [OFFER] Sending offer to peer");
      if (mountedRef.current) {
      socket?.emit('sendOffer', { offer, videoRoomId });
      }
    } catch (error) {
      console.error("❌ [ERROR] Error creating offer:", error);
      toast.error('Failed to start call');
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    const initializeCall = async () => {
      try {
        console.log("🎧 [INIT] Setting up socket listeners");
        setupSocketListeners();

        console.log("📹 [MEDIA] Requesting user media access");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true
        });

        if (!mountedRef.current) {
          console.log("⚠️ [CLEANUP] Component unmounted during initialization");
          return;
        }
        
        console.log("✅ [MEDIA] Successfully got local media stream");
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          console.log("🎥 [MEDIA] Setting local video stream");
          localVideoRef.current.srcObject = stream;
        }

        if (socket && videoRoomId && mountedRef.current) {
          console.log("🔌 [SOCKET] Joining room:", videoRoomId);
          socket.emit('joinRoom', videoRoomId);
        }
      } catch (error) {
        console.error("❌ [ERROR] Failed to initialize call:", error);
        toast.error('Failed to access camera/microphone');
        handleCallEnd();
      }
    };

    if (socket && videoRoomId) {
      console.log("🚀 [INIT] Starting call initialization");
      initializeCall();
    }

    return () => {
      console.log("🧹 [CLEANUP] Component unmounting");
      mountedRef.current = false;
      cleanup();
    };
  }, []);

  const handleCallEnd = () => {
    if (!mountedRef.current) return;
    console.log("👋 [CALL] Ending call");
    socket?.emit('endCall', videoRoomId);
    cleanup();
    router.push(`/user/chat`);
  };

  const cleanup = () => {
    console.log("🧹 [CLEANUP] Starting cleanup");
    if (localStreamRef.current) {
      console.log("🎥 [MEDIA] Stopping all tracks");
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      console.log("🔌 [RTC] Closing peer connection");
      peerConnectionRef.current.close();
    }
    peerConnectionRef.current = null;
    localStreamRef.current = null;
  };


  const toggleMedia = (type: 'audio' | 'video') => {
    if (!localStreamRef.current) return;

    const tracks = type === 'audio' 
      ? localStreamRef.current.getAudioTracks() 
      : localStreamRef.current.getVideoTracks();

    tracks.forEach(track => {
      track.enabled = !track.enabled;
      if (type === 'audio') setIsAudioEnabled(track.enabled);
      if (type === 'video') setIsVideoEnabled(track.enabled);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full rounded-lg bg-gray-800 object-cover"
            />
            <div className="absolute bottom-2 left-2 text-sm text-white bg-black/50 px-2 py-1 rounded">
              You {!isVideoEnabled && '(Camera Off)'}
            </div>
          </div>

          <div className="relative aspect-video">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full rounded-lg bg-gray-800 object-cover"
            />
            <div className="absolute bottom-2 left-2 text-sm text-white bg-black/50 px-2 py-1 rounded">
              Remote {!isCallConnected && '(Connecting...)'}
            </div>
          </div>
        </div>

        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3">
          <button
            onClick={() => toggleMedia('audio')}
            className={`p-3 rounded-full ${
              isAudioEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
            } transition-colors`}
          >
            {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          <button
            onClick={() => toggleMedia('video')}
            className={`p-3 rounded-full ${
              isVideoEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
            } transition-colors`}
          >
            {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button
            onClick={handleCallEnd}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;
