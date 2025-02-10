import React from 'react';

const NotificationBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;

  return (
    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {count > 99 ? '99+' : count}
    </div>
  );
};

export default NotificationBadge;