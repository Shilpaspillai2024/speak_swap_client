
'use client';
import React, { memo } from 'react';
import UserNavbar from '@/components/UserNavbar';

const MemoizedNavbar = memo(UserNavbar);

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <MemoizedNavbar />
      <div className="flex-1 bg-gray-50 overflow-hidden">
        <div className="container mx-auto p-4 h-full">
          <div className="grid grid-cols-12 gap-4 bg-white rounded-xl shadow-lg h-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}