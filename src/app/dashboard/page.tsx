'use client'
import React from 'react'
import UserProtectedRoute from '@/HOC/UserProtectedRoute'
import UserNavbar from '@/components/UserNavbar'

const UserDashboard = () => {
  return (
    <div>
      <UserNavbar/>
      hello Welcome
    </div>
  )
}

export default UserProtectedRoute(UserDashboard)
