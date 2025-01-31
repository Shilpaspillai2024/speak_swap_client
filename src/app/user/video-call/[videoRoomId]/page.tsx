'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';
import socketStore from '@/store/socketStore';

const VideoCallPage = () => {
  const { videoRoomId } = useParams();
  console.log("[INIT] Video Call Page Loaded - Video Room ID:", videoRoomId);

  const router = useRouter();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isCallConnected, setIsCallConnected] = useState(false);


  const socket = socketStore.getState().socket;
  console.log("[SOCKET] Socket initialized:", socket);

  const isCallInitiator = sessionStorage.getItem("isCallInitiator") === "true";
   console.log("[CALL] Is Call Initiator:", isCallInitiator);


  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  const createPeerConnection = () => {
    console.log("[RTC] Creating PeerConnection...");
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log("[RTC] Sending ICE candidate:", event.candidate);
        socket.emit('sendCandidate', { 
          candidate: event.candidate, 
          videoRoomId,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("[RTC] Received Remote Track:", event.streams);
      if (event.streams && event.streams[0]) {
        const remoteStream = new MediaStream();
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`[RTC] ICE Connection State Changed: ${pc.iceConnectionState}`);
      if (pc.iceConnectionState === 'failed') {
        pc.restartIce();
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`[RTC] Connection State Changed: ${pc.connectionState}`);
      if (pc.connectionState === 'connected') {
        console.log("[RTC] Peer-to-peer connection established!");
        setIsCallConnected(true);
      }
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        console.log("[RTC] Peer disconnected. Ending call.");
        handleCallEnd();
      }
    };

    peerConnectionRef.current=pc;

    return pc;
  };

  useEffect(() => {
    let isMounted = true;
    const initiator = sessionStorage.getItem("isCallInitiator") === "true";
  
    console.log(`[CALL] Is Call Initiator: ${initiator}`);

    const initializeMedia = async () => {
      try {
        console.log("[MEDIA] Requesting user media...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true
        });

        if (!isMounted) return;
        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        console.log("[MEDIA] Local stream acquired:", stream);

        if (!peerConnectionRef.current) {
          peerConnectionRef.current = createPeerConnection();
      }
        stream.getTracks().forEach(track => peerConnectionRef.current?.addTrack(track, stream));

        if (socket && videoRoomId) {
          console.log(`[SOCKET] Joining Room: ${videoRoomId}`);
          socket.emit('joinRoom', videoRoomId);
        }
      } catch (error) {
        console.error("[ERROR] Failed to access media devices:", error);
        toast.error('Failed to access media devices');
        handleCallEnd();
      }
    };

    if (socket && videoRoomId) {
      initializeMedia();
      setupSocketListeners();
    }

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [socket, videoRoomId]);

  const setupSocketListeners = () => {
    if (!socket) return;

    socket.on('callAccepted', async () => {
      console.log("[SOCKET] Call accepted. Initiator creating and sending offer...");
      console.log("isCallIntitiator",isCallInitiator)
      if (isCallInitiator) {
        await createAndSendOffer();
      }
    });

    socket.on('receiveOffer', async ({ offer }) => {
      console.log("[SOCKET] Received Offer:", offer);
      if (!peerConnectionRef.current){
        console.log("[RTC] Creating peer connection...");
    peerConnectionRef.current = createPeerConnection();
      }  

      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        console.log("[RTC] Remote description set (Offer)");
        
        const answer = await peerConnectionRef.current.createAnswer();
        console.log("[RTC] Answer created:", answer);
        
        await peerConnectionRef.current.setLocalDescription(answer);
        console.log("[RTC] Local description set (Answer)");
        console.log("answer",answer, videoRoomId)
        socket.emit('sendAnswer', { answer, videoRoomId });
      } catch (error) {
        console.error("[ERROR] Offer handling error:", error);
      }
    });

    socket.on('receiveAnswer', async ({ answer }) => {
      console.log("[SOCKET] Received Answer:", answer);
      if (!peerConnectionRef.current) return;

      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("[RTC] Remote description set (Answer)");
      } catch (error) {
        console.error("[ERROR] Answer handling error:", error);
      }
    });

    socket.on('receiveCandidate', async ({ candidate }) => {
      console.log("[SOCKET] Received ICE Candidate:", candidate);
      if (!peerConnectionRef.current || !peerConnectionRef.current.remoteDescription) {
        console.warn("[RTC] ICE candidate received before remote description is set. Buffering candidate.");
        setTimeout(() => socket.emit('receiveCandidate', { candidate }), 100);
        return;
    }
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("[RTC] ICE candidate added");
      } catch (error) {
        console.error("[ERROR] Candidate handling error:", error);
      }
    });

    socket.on('remoteDisconnect', () => {
      console.log("[SOCKET] Remote user disconnected. Ending call.");
      toast.info('Other user disconnected');
      handleCallEnd();
    });
  };

  const createAndSendOffer = async () => {
    if (!peerConnectionRef.current || peerConnectionRef.current.localDescription) {
      console.log("[RTC] Local description already set, skipping offer creation.");
      return;
    }

    
    try {
      console.log("[RTC] Creating Offer...");
      const offer = await peerConnectionRef.current.createOffer();
      console.log("offer",offer)
      
      await peerConnectionRef.current.setLocalDescription(offer);
      console.log("[RTC] Sent Offer:", offer);

      socket?.emit('sendOffer', { offer, videoRoomId });
    } catch (error) {
      console.error("[ERROR] Offer creation error:", error);
    }
  };

  const handleCallEnd = () => {
    console.log("[CALL] Ending call...");
    socket?.emit('endCall', videoRoomId);
    cleanup();
    router.push(`/user/chat`);
  };

  const cleanup = () => {
    console.log("[CALL] Cleaning up resources...");
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
    peerConnectionRef.current?.close();
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