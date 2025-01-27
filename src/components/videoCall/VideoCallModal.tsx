import React from "react";
import { Video, Phone } from "lucide-react";

interface VideoCallModalProps {
    senderId: string;
    onAccept: () => void;
    onReject: () => void;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ senderId, onAccept, onReject }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md w-full transform transition-all">
                <div className="mb-6 flex justify-center">
                    <Video className="w-24 h-24 text-blue-500 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Incoming Video Call
                </h2>
                <p className="text-gray-600 mb-6">
                    <span className="font-semibold">{senderId}</span> is calling you
                </p>
                <div className="flex justify-center space-x-4">
                    <button 
                        onClick={onAccept} 
                        className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                        <Video className="w-6 h-6 mr-2" /> Accept
                    </button>
                    <button 
                        onClick={onReject} 
                        className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                        <Phone className="w-6 h-6 mr-2 rotate-135" /> Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCallModal;