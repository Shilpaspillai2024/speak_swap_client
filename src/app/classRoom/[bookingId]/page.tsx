"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import socketStore from "@/store/socketStore";
import { completeSession } from "@/services/tutorApi";
import {
    Mic, MicOff, Video as VideoIcon, VideoOff,
    PhoneOff, Users, MessageCircle, X, Send,
    ChevronRight, ChevronLeft
  } from "lucide-react";
import { toast } from "react-toastify";

interface Message {
  message: string;
}

interface ChatMessage{
    id:string;
    sender:string;
    text:string;
    timestamp:string;
    senderRole:'tutor' | 'student'
}

const ClassRoom = () => {
  const { bookingId } = useParams();
  const [error, setError] = useState("");
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [participantCount, setParticipantCount] = useState(1);
  const [remoteUserJoined, setRemoteUserJoined] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);




  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream>(new MediaStream());
  const isInitiator = useRef<boolean>(false);
  const makingOffer = useRef<boolean>(false);
  const ignoreOffer = useRef<boolean>(false);

  const chatEndRef=useRef<HTMLDivElement>(null);

  const { bookingDetails } = useBookingStore();
  const socket = socketStore.getState().socket;

  


  useEffect(() => {
    if (bookingDetails?.userRole === "tutor") {
      isInitiator.current = true;
    }
  }, [bookingDetails?.userRole]);

  const initializeLocalStream = async () => {
    try {
      console.log("Initializing local stream");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream.current;
      }

      return stream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setError("Could not access camera/microphone. Please check permissions.");
      return null;
    }
  };

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await initializeLocalStream();
        if (stream) {
          console.log("Local stream initialized successfully");
          setIsSessionReady(true);
        }
      } catch (err) {
        console.error("Error initializing media:", err);
        setError("Failed to initialize media devices");
      }
    };

    initializeMedia();

    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const initializePeerConnection = async () => {
    try {
      console.log("Initializing peer connection");
      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      };

      if (peerConnection.current) {
        peerConnection.current.close();
      }

      const pc = new RTCPeerConnection(configuration);
      peerConnection.current = pc;

      // Set up track handling
      pc.ontrack = (event) => {
        console.log("Received remote track:", event.track.kind);
        event.streams[0].getTracks().forEach((track) => {
          const existingTrack = remoteStream.current
            .getTracks()
            .find((t) => t.kind === track.kind);
          if (existingTrack) {
            console.log(`Removing existing ${track.kind} track`);
            remoteStream.current.removeTrack(existingTrack);
          }
          console.log(`Adding new ${track.kind} track`);
          remoteStream.current.addTrack(track);
        });

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream.current;
        }
        setParticipantCount(2);
        setRemoteUserJoined(true);
      };

      // Ensure local stream exists and add tracks
      if (!localStream.current) {
        console.log("Local stream not found, initializing...");
        localStream.current = await initializeLocalStream();
      }

      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => {
          console.log(`Adding local ${track.kind} track to peer connection`);
          pc.addTrack(track, localStream.current!);
        });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("New ICE candidate");
          socket?.emit("candidate", {
            candidate: event.candidate,
            bookingId,
          });
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log("ICE Connection State:", pc.iceConnectionState);
      };

      pc.onnegotiationneeded = async () => {
        try {
          makingOffer.current = true;
          console.log("Negotiation needed - creating offer");
          const offer = await pc.createOffer();
          if (pc.signalingState !== "closed") {
            await pc.setLocalDescription(offer);
            socket?.emit("offer", { offer: pc.localDescription, bookingId });
          }
        } catch (err) {
          console.error("Error during negotiation:", err);
        } finally {
          makingOffer.current = false;
        }
      };

      return pc;
    } catch (err) {
      console.error("Error in initializePeerConnection:", err);
      setError("Failed to initialize peer connection.");
      return null;
    }
  };

  useEffect(() => {
    if (!socket || !bookingDetails?.userRole) return;

    const handleUserJoined = async ({ userRole }: { userRole: string }) => {
      console.log("Remote user joined:", userRole);
      setRemoteUserJoined(true);

      if (isInitiator.current) {
        console.log("Initializing connection as initiator");
        await initializePeerConnection();
      }
    };

    const handleSessionEnded = ({ message }: Message) => {
      console.log("Session ended by remote user");
      toast.info(message);

      setTimeout(() => {
        cleanup();
        window.location.href =
          bookingDetails?.userRole === "tutor"
            ? "/tutor/schedules/myschedules"
            : "/dashboard";
      }, 3000);
    };

    const handleOffer = async ({
      offer,
    }: {
      offer: RTCSessionDescriptionInit;
    }) => {
      console.log("Received offer");
      try {
        let pc = peerConnection.current;
        if (!pc) {
          pc = await initializePeerConnection();
          if (!pc) return;
        }

        const offerCollision =
          makingOffer.current || pc.signalingState !== "stable";
        ignoreOffer.current = !isInitiator.current && offerCollision;
        if (ignoreOffer.current) {
          console.log("Ignoring colliding offer");
          return;
        }

        console.log("Setting remote description from offer");
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        while (iceCandidatesQueue.current.length) {
          const candidate = iceCandidatesQueue.current.shift();
          if (candidate) {
            console.log("Adding queued ICE candidate");
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        }

        console.log("Creating answer");
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket?.emit("answer", { answer: pc.localDescription, bookingId });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    const handleAnswer = async ({
      answer,
    }: {
      answer: RTCSessionDescriptionInit;
    }) => {
      console.log("Received answer");
      try {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        }
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    };

    const handleCandidate = async ({
      candidate,
    }: {
      candidate: RTCIceCandidateInit;
    }) => {
      try {
        if (peerConnection.current?.remoteDescription) {
          console.log("Adding ICE candidate");
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } else {
          console.log("Queueing ICE candidate");
          iceCandidatesQueue.current.push(candidate);
        }
      } catch (err) {
        console.error("Error handling ICE candidate:", err);
      }
    };

    console.log(
      "Joining session:",
      bookingDetails.bookingId,
      bookingDetails.userRole
    );
    socket.emit("joinSession", {
      bookingId: bookingDetails.bookingId,
      userRole: bookingDetails.userRole,
    });

    socket.on("sessionEnded", handleSessionEnded);
    socket.on("userJoinedSession", handleUserJoined);
    socket.on("receivevideoOffer", handleOffer);
    socket.on("receivevideoAnswer", handleAnswer);
    socket.on("candidate", handleCandidate);

    return () => {
      socket.off("userJoinedSession", handleUserJoined);
      socket.off("receivevideoOffer", handleOffer);
      socket.off("receivevideoAnswer", handleAnswer);
      socket.off("candidate", handleCandidate);

      cleanup();
    };
  }, [socket, bookingId, bookingDetails]);

  const cleanup = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped local ${track.kind} track`);
      });
      localStream.current = null;
    }

    if (remoteStream.current) {
      remoteStream.current.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped remote ${track.kind} track`);
      });
      remoteStream.current = new MediaStream();
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
      console.log("Closed peer connection");
    }

    // Reset video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Reset state
    setRemoteUserJoined(false);
    setParticipantCount(1);
    setIsSessionReady(false);
  };

  const endCall = async() => {
    if (!bookingId || Array.isArray(bookingId)) {
      console.error("Invalid bookingId:", bookingId);
      return;
    }
    await completeSession(bookingId)
    socket?.emit("endSession", { bookingId });
    toast.warning("you have ended the session");
    setTimeout(() => {
      cleanup();
      window.location.href =
        bookingDetails?.userRole === "tutor"
          ? "/tutor/schedules/myschedules"
          : "/dashboard";
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: bookingDetails?.userRole === 'tutor' ? 'Tutor' : 'Student',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      senderRole: bookingDetails?.userRole === 'tutor' ? 'tutor' : 'student'
    };

    socket?.emit('chatMessage', { message, bookingId });
    setMessages(prev => [...prev, message]);
    setNewMessage("");
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('chatMessage', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
      if (!isChatOpen) {
        setUnreadCount(prev => prev + 1);
      }
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => {
      socket.off('chatMessage');
    };
  }, [socket, isChatOpen]);

  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0);
    }
  }, [isChatOpen]);


  const toggleAudio = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
        console.log(`Audio ${track.enabled ? "enabled" : "disabled"}`);
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
        console.log(`Video ${track.enabled ? "enabled" : "disabled"}`);
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden relative">
    <div className="h-screen flex flex-col md:flex-row">
      {/* Main content area */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="h-full bg-gray-800 rounded-xl shadow-2xl p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Classroom</h1>
              <div className="flex items-center bg-gray-700/50 px-3 py-1.5 rounded-lg">
                <Users className="w-4 h-4 text-gray-300 mr-2" />
                <span className="text-gray-300">{participantCount}</span>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="relative bg-gray-700/50 p-2.5 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-gray-300" />
              {!isChatOpen && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
  
          {/* Video container */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-900/50 rounded-xl p-4 overflow-hidden">
            <div className="relative w-full h-full max-w-4xl mx-auto flex items-center justify-center">
              {/* Remote video */}
              <div className="w-full h-full max-h-[70vh] aspect-video rounded-xl overflow-hidden bg-gray-700 shadow-2xl">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
  
              {/* Local video */}
              <div className="absolute bottom-4 right-4 w-48 md:w-64 shadow-2xl rounded-xl overflow-hidden border-2 border-gray-700/50">
                <div className="aspect-video">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
  
          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-full transition-colors ${
                isAudioEnabled ? "bg-gray-700/50 hover:bg-gray-600" : "bg-red-500/90 hover:bg-red-600"
              }`}
            >
              {isAudioEnabled ? (
                <Mic className="w-6 h-6 text-white" />
              ) : (
                <MicOff className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                isVideoEnabled ? "bg-gray-700/50 hover:bg-gray-600" : "bg-red-500/90 hover:bg-red-600"
              }`}
            >
              {isVideoEnabled ? (
                <VideoIcon className="w-6 h-6 text-white" />
              ) : (
                <VideoOff className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={endCall}
              className="p-3 rounded-full bg-red-500/90 hover:bg-red-600 transition-colors"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
  
      {/* Chat sidebar */}
      <div
        className={`w-96 bg-gray-800 transform transition-transform duration-300 fixed right-0 top-0 bottom-0 shadow-2xl ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Chat header */}
          <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Chat</h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
  
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderRole === bookingDetails?.userRole ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.senderRole === bookingDetails?.userRole
                      ? 'bg-blue-600/90 text-white'
                      : 'bg-gray-700/50 text-white'
                  }`}
                >
                  <p className="text-sm font-medium mb-1">{message.sender}</p>
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
  
          {/* Chat input */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700/50 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600/90 hover:bg-blue-700 text-white rounded-lg p-2.5 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    {/* Error message */}
    {error && (
      <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    )}
  </div>
  );
};

export default ClassRoom;
