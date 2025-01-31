import React from 'react';
import { Phone, PhoneOff } from 'lucide-react';

interface VideoCallModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
  callerName: string | null;
}

const VideoCallModal = ({ isOpen, onAccept, onReject, callerName }: VideoCallModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Incoming Video Call
          </h3>
          <p className="text-gray-600 mb-6">
            {callerName} is calling you...
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={onAccept}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Accept
            </button>
            <button
              onClick={onReject}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoCallModal