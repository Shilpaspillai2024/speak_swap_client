"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users } from "lucide-react";
import socketStore from "@/store/socketStore";
import UserProtectedRoute from "@/HOC/UserProtectedRoute";

const VideoCallPage = () => {
  const { videoRoomId } = useParams();
  console.log("🚀 [INIT] Starting VideoCallPage with roomId:", videoRoomId);

  const router = useRouter();
  const socket = socketStore.getState().socket;
  console.log(
    "🔌 [SOCKET] Initial socket state:",
    socket ? "Connected" : "Not connected"
  );

  const isCallInitiator = sessionStorage.getItem("isCallInitiator") === "true";
  console.log("👤 [ROLE] User is call initiator:", isCallInitiator);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const iceCandidatesBuffer = useRef<RTCIceCandidate[]>([]);
  const mountedRef = useRef(false);
  const connectionAttempts = useRef(0);
  const callEstablishedRef = useRef(false);

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };
  
  const cleanup = useCallback(() => {
    console.log("🧹 Cleaning up video call resources...");
  
    // Stop local stream
    if (localStreamRef.current) {
      console.log("🎥 Stopping local stream:", localStreamRef.current);
      localStreamRef.current.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
        console.log(`✅ Track stopped: ${track.kind}, track.readyState: ${track.readyState}`);
      });
      localStreamRef.current = null;
    } else {
      console.warn("⚠️ localStreamRef is already null!");
    }
  
    // Stop remote stream
    if (remoteVideoRef.current?.srcObject instanceof MediaStream) {
      console.log("🎥 Stopping remote stream tracks");
      (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
  
    // Clear video elements
    if (localVideoRef.current){
      console.log("🛑 Clearing local video element");
      localVideoRef.current.srcObject = null;
    }
      
    if (remoteVideoRef.current) {
      console.log("🛑 Clearing remote video element");
      remoteVideoRef.current.srcObject = null;
    }

    // Release media devices
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());
        console.log("🔄 Released media devices");
      })
      .catch(error => console.error("❌ Error releasing media devices:", error));
  
    // Close peer connection
    if (peerConnectionRef.current) {
      console.log("🔌 Closing peer connection");
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  
    // Reset states
    setIsAudioEnabled(true);
    setIsVideoEnabled(true);
    setIsCallConnected(false);
    setIsConnecting(true);
    callEstablishedRef.current = false;
    connectionAttempts.current = 0;

    if (socket) {
      console.log("🚫 Removing socket listeners");
      socket.off("callAccepted");
      socket.off("receiveOffer");
      socket.off("receiveAnswer");
      socket.off("receiveCandidate");
      socket.off("remoteDisconnect");
      socket.off("endCall");
    }
  
    // Clear ICE candidates buffer
    iceCandidatesBuffer.current = [];
  
    console.log("✅ Cleanup complete.");
  }, [socket]);
  
  const handleCallEnd = useCallback(async () => {
    console.log("📞 Ending call...");
  
    // Notify the server
    if (socket && videoRoomId) {
      console.log("📡 Emitting 'endCall' to server");
      socket.emit("endCall", { videoRoomId });
    }

    cleanup();

    setTimeout(() => {
      router.push("/user/chat");
    }, 1000);
  }, [cleanup, router, socket, videoRoomId]);

  // Retry mechanism for initial connection failures
  const retryConnection = useCallback(() => {
    if (!mountedRef.current || callEstablishedRef.current) return;
    
    connectionAttempts.current += 1;
    console.log(`🔄 [RETRY] Connection attempt ${connectionAttempts.current}`);
    
    if (connectionAttempts.current > 3) {
      console.log("❌ [RETRY] Maximum retries reached, giving up");
      toast.error("Failed to establish call connection");
      return;
    }
    
    if (isCallInitiator) {
      // Close existing connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      
      // Create new connection and send offer
      const pc = createPeerConnection();
      
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }
      
      createAndSendOffer();
    }
  }, [isCallInitiator]);

  const createPeerConnection = () => {
    if (peerConnectionRef.current) {
      console.log("⚠️ [RTC] PeerConnection already exists, closing and creating new one");
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    console.log("🔨 [RTC] Creating new PeerConnection with config:", configuration);
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket && mountedRef.current) {
        console.log("🧊 [ICE] Generated new local ICE candidate:", event.candidate.candidate);
        socket.emit("sendCandidate", {
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
        setIsCallConnected(true);
        setIsConnecting(false);
        callEstablishedRef.current = true;
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (!mountedRef.current) return;

      console.log(`🧊 [ICE] Connection state changed to: ${pc.iceConnectionState}`);
      
      if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        setIsCallConnected(true);
        setIsConnecting(false);
        callEstablishedRef.current = true;
      }
      
      if (pc.iceConnectionState === "failed") {
        console.log("🔄 [ICE] Connection failed, attempting to restart ICE");
        pc.restartIce();
        
        // If we're still in the initial connection phase, try again
        if (!callEstablishedRef.current) {
          setTimeout(retryConnection, 2000);
        }
      }
    };

    pc.onconnectionstatechange = () => {
      if (!mountedRef.current) return;
      console.log(`🔗 [RTC] Connection state changed to: ${pc.connectionState}`);
      
      if (pc.connectionState === "connected") {
        setIsCallConnected(true);
        setIsConnecting(false);
        callEstablishedRef.current = true;
      }

      if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        console.log("❌ [RTC] Connection failed or disconnected");
        
        // Only end call if we previously had a connection
        if (callEstablishedRef.current) {
          handleCallEnd();
        } else {
          // Otherwise, retry
          setTimeout(retryConnection, 2000);
        }
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const createAndSendOffer = async () => {
    if (!mountedRef.current) return;
    const pc = peerConnectionRef.current;
    if (!pc) {
      console.log("⚠️ [OFFER] Cannot create offer - no peer connection");
      return;
    }

    try {
      console.log("📝 [OFFER] Creating offer");
      const offer = await pc.createOffer();
      console.log("📝 [OFFER] Setting local description:", offer);
      await pc.setLocalDescription(offer);

      console.log("📤 [OFFER] Sending offer to peer");
      if (mountedRef.current) {
        socket?.emit("sendOffer", { offer, videoRoomId });
      }
    } catch (error) {
      console.error("❌ [ERROR] Error creating offer:", error);
      toast.error("Failed to start call");
    }
  };

  const setupSocketListeners = () => {
    if (!socket || !mountedRef.current) {
      return;
    }

    // Remove any existing listeners to prevent duplicates
    socket.off("callAccepted");
    socket.off("receiveOffer");
    socket.off("receiveAnswer");
    socket.off("receiveCandidate");
    socket.off("remoteDisconnect");
    socket.off("endCall");

    socket.on("callAccepted", async () => {
      if (!mountedRef.current) return;
      console.log("📞 [CALL] Call accepted event received");

      if (isCallInitiator) {
        console.log("📞 [CALL] Initiator starting WebRTC connection");
        
        // Create peer connection with slight delay to ensure everything is ready
        setTimeout(() => {
          if (!mountedRef.current) return;
          
          // Create peer connection
          const pc = createPeerConnection();

          // Add local tracks to the connection
          if (localStreamRef.current) {
            console.log("🎥 [MEDIA] Adding local tracks to connection");
            localStreamRef.current.getTracks().forEach((track) => {
              pc.addTrack(track, localStreamRef.current!);
            });
          }

          // Create and send offer
          createAndSendOffer();
          
          // Set up a timeout to retry if connection isn't established
          setTimeout(() => {
            if (!callEstablishedRef.current && mountedRef.current) {
              retryConnection();
            }
          }, 5000);
        }, 1000);
      }
    });

    socket.on("receiveOffer", async ({ offer }) => {
      if (!mountedRef.current) return;
      console.log("📥 [OFFER] Received offer from peer");
      
      try {
        // Create peer connection if not exists
        const pc = createPeerConnection();

        // Add local tracks
        if (localStreamRef.current) {
          console.log("🎥 [MEDIA] Adding local tracks to connection");
          localStreamRef.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStreamRef.current!);
          });
        }

        // Set remote description (the offer)
        console.log("📝 [OFFER] Setting remote description");
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        // Process any buffered ICE candidates
        while (iceCandidatesBuffer.current.length > 0 && mountedRef.current) {
          const candidate = iceCandidatesBuffer.current.shift();
          if (candidate) {
            console.log("🧊 [ICE] Adding buffered candidate");
            await pc.addIceCandidate(candidate);
          }
        }

        // Create and set local description (the answer)
        console.log("📝 [ANSWER] Creating answer");
        const answer = await pc.createAnswer();
        console.log("📝 [ANSWER] Setting local description");
        await pc.setLocalDescription(answer);

        // Send answer back to peer
        if (mountedRef.current) {
          console.log("📤 [ANSWER] Sending answer to peer");
          socket.emit("sendAnswer", { answer, videoRoomId });
        }
      } catch (error) {
        console.error("❌ [ERROR] Failed to process call offer:", error);
        toast.error("Failed to process call offer");
      }
    });

    socket.on("receiveAnswer", async ({ answer }) => {
      if (!mountedRef.current) return;
      console.log("📥 [ANSWER] Received answer from peer");
      
      try {
        const pc = peerConnectionRef.current;
        if (!pc) {
          console.error("❌ [ERROR] No peer connection when receiving answer");
          return;
        }
        
        console.log("📝 [ANSWER] Setting remote description");
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error("❌ [ERROR] Failed to process call answer:", error);
        toast.error("Failed to process call answer");
      }
    });

    socket.on("receiveCandidate", async ({ candidate }) => {
      if (!mountedRef.current) return;
      console.log("📥 [ICE] Received ICE candidate from peer");
      
      try {
        const pc = peerConnectionRef.current;
        const newCandidate = new RTCIceCandidate(candidate);
        
        if (!pc || !pc.remoteDescription) {
          console.log("🧊 [ICE] Buffering ICE candidate - no remote description yet");
          iceCandidatesBuffer.current.push(newCandidate);
          return;
        }
        
        console.log("🧊 [ICE] Adding received ICE candidate");
        await pc.addIceCandidate(newCandidate);
      } catch (error) {
        console.error("❌ [ERROR] Failed to process ICE candidate:", error);
        toast.error("Failed to process connection information");
      }
    });

    socket.on("remoteDisconnect", () => {
      if (!mountedRef.current) return;
      console.log("👋 [PEER] Remote peer disconnected");
      toast.info("Other user disconnected");
      handleCallEnd();
    });

    socket.on("endCall", () => {
      if (!mountedRef.current) return;
      console.log("📞 [CALL] Received end call event from server");
      toast.info("Call ended by other user");
      handleCallEnd();
    });
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
          audio: true,
        });

        console.log("✅ [MEDIA] Successfully got local media stream");
        localStreamRef.current = stream;

        if (!mountedRef.current) {
          console.log("⚠️ [CLEANUP] Component unmounted during initialization");
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        if (localVideoRef.current) {
          console.log("🎥 [MEDIA] Setting local video stream");
          localVideoRef.current.srcObject = stream;
        }

        if (socket && videoRoomId && mountedRef.current) {
          console.log("🔌 [SOCKET] Joining room:", videoRoomId);
          socket.emit("joinRoom", videoRoomId);
          
        
          setIsConnecting(true);
        }
      } catch (error) {
        console.error("❌ [ERROR] Failed to initialize call:", error);
        toast.error("Failed to access camera/microphone");
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
  }, [socket, videoRoomId, cleanup, handleCallEnd]);

  const toggleMedia = (type: "audio" | "video") => {
    if (!localStreamRef.current) return;

    const tracks =
      type === "audio"
        ? localStreamRef.current.getAudioTracks()
        : localStreamRef.current.getVideoTracks();

    tracks.forEach((track) => {
      track.enabled = !track.enabled;
      if (type === "audio") setIsAudioEnabled(track.enabled);
      if (type === "video") setIsVideoEnabled(track.enabled);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Connection Status Banner */}
        {isConnecting && (
          <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center justify-center space-x-2">
            <Users className="animate-pulse text-blue-500" size={20} />
            <span className="text-blue-200">Establishing connection...</span>
          </div>
        )}

        {/* Main Video Container */}
        <div className="relative w-full aspect-video">
          {/* Remote Video (Full Screen) */}
          <div className="w-full h-full rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isCallConnected ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                <span className="text-sm font-medium text-white">Remote User</span>
              </div>
              {!isCallConnected && (
                <span className="bg-yellow-500/80 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                  Connecting...
                </span>
              )}
            </div>
          </div>

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-72 aspect-video rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg bg-gray-800/50">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2 flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-white">You</span>
              </div>
              {!isVideoEnabled && (
                <span className="bg-red-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  Camera Off
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-4 bg-gray-800/90 backdrop-blur-md rounded-full px-8 py-4 border border-gray-700 shadow-lg">
            <button
              onClick={() => toggleMedia("audio")}
              className={`p-4 rounded-full transition-all duration-200 ${
                isAudioEnabled
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <button
              onClick={() => toggleMedia("video")}
              className={`p-4 rounded-full transition-all duration-200 ${
                isVideoEnabled
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
            </button>

            <div className="w-px h-8 bg-gray-700" />

            <button
              onClick={handleCallEnd}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 text-white"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProtectedRoute(VideoCallPage);