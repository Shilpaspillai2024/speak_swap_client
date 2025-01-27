"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import socketStore from "@/store/socketStore";
import { useRouter } from "next/navigation";
const VideoCall = () => {
  const { chatId } = useParams();
  const socket = socketStore.getState().socket;

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isOfferSent, setIsOfferSent] = useState(false); // New state to track if the offer is sent
  const router=useRouter();
  useEffect(() => {
    if (!socket || !chatId) return;

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Get local video & audio
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          peerConnection.current?.addTrack(track, stream);
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    // Handle remote stream
    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { chatId, candidate: event.candidate });
      }
    };

    // Receive an offer
    socket.on("offer", async ({ offer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("answer", { chatId, answer });
      }
    });

    // Receive an answer
    socket.on("answer", async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    // Receive ICE candidates
    socket.on("ice-candidate", async ({ candidate }) => {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });

    // Handle user leaving
    socket.on("user-left", () => {
      endCall();
    });

    // Cleanup on unmount
    return () => {
      endCall();
      socket.emit("leaveCall", { chatId });
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
    };
  }, [chatId, socket]);


 
  // Start a call (only one peer should initiate)
  const startCall = async () => {
    if (!peerConnection.current || !socket) return;

    if (!isOfferSent) {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("offer", { chatId, offer });
      setIsOfferSent(true); // Mark the offer as sent
      setIsCallActive(true);
    }
  };

  // End the call
  const endCall = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setIsCallActive(false);
    setIsOfferSent(false); // Reset offer status
    socket?.emit("leaveCall", { chatId });
    router.push(`/chat/${chatId}`);
  };


  useEffect(() => {
    if (!socket || !chatId) return;
  
    const handleCallAccepted = () => {
      console.log('Call accepted');
      startCall();
    };
  
    const handleCallRejected = () => {
      console.log('Call rejected');
     
      router.push(`/chat/${chatId}`);
    };
  
    socket.on('callAccepted', handleCallAccepted);
    socket.on('callRejected', handleCallRejected);
  
    // Cleanup listeners
    return () => {
      socket.off('callAccepted', handleCallAccepted);
      socket.off('callRejected', handleCallRejected);
    };
  }, [socket, chatId, startCall, router]);


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="w-1/2 h-auto border"
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-1/2 h-auto border mt-4"
      />

      <div className="mt-4">
        {!isCallActive ? (
          <button
            onClick={startCall}
            className="px-6 py-2 bg-blue-500 text-white rounded"
          >
            Start Call
          </button>
        ) : (
          <button
            onClick={endCall}
            className="px-6 py-2 bg-red-500 text-white rounded"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
