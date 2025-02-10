import { create } from 'zustand'

  
  interface VideoCallState {
    isCallModalOpen: boolean;
    callerName: string | null;
    videoRoomId: string | null;
    setCallModal: (isOpen: boolean, callerName?: string | null, videoRoomId?: string | null) => void;
  }
  
  const useVideoCallStore = create<VideoCallState>((set) => ({
    isCallModalOpen: false,
    callerName: null,
    videoRoomId: null,
    setCallModal: (isOpen, callerName = null, videoRoomId = null) =>
      set({ isCallModalOpen: isOpen, callerName, videoRoomId }),
  }))
  
  export default useVideoCallStore