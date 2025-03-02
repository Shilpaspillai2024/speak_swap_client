"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import AdminNavbar from "@/components/AdminNavbar";
import AdminProtectedRoute from "@/HOC/AdminProtectedRoute";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";
import { IndianRupeeIcon, Users, GraduationCap, BookOpen, Globe, Lightbulb, MessageCircle } from "lucide-react";
import { fetchadminDashboard } from "@/services/adminApi";
import { useRouter } from "next/navigation";



interface DashboardStats {
  userCount: number;
  tutorCount: number;
  bookingCount: number;
  totalRevenue: number;
  pendingTutorApprovals: number;
  activeUsers: number;
  completedSessions: number;
}

interface BookingTrend {
  month: string;
  bookings: number;
}

interface LanguageStat {
  name: string;
  count: number;
}

interface ActivityItem {
  type: 'user' | 'tutor' | 'booking' | 'payment' | 'other';
  message: string;
  timestamp: string;
}

interface DashboardData {
  stats: DashboardStats;
  bookingTrend: BookingTrend[];
  languageStats: LanguageStat[];
  recentActivity: ActivityItem[];
}


const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const router=useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      userCount: 0,
      tutorCount: 0,
      bookingCount: 0,
      totalRevenue: 0,
      pendingTutorApprovals: 0,
      activeUsers: 0,
      completedSessions: 0
    },
    bookingTrend: [],
    languageStats: [],
    recentActivity: []
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetchadminDashboard();
        if (response?.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    const intervalId = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);


  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <div className="flex-1 p-6 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage your language learning platform, connect users, and oversee tutoring services
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 mb-6">
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === "overview" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === "users" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("users")}
            >
              Users & Tutors
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === "sessions" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("sessions")}
            >
              Sessions & Bookings
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === "finance" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("finance")}
            >
              Finance
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <Users className="text-indigo-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.stats.userCount}</p>
                <p className="text-green-500 text-xs">↑ 12% from last month</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <GraduationCap className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Tutors</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.stats.tutorCount}</p>
                <p className="text-green-500 text-xs">↑ 8% from last month</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="bg-pink-100 p-3 rounded-full mr-4">
                <BookOpen className="text-pink-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.stats.bookingCount}</p>
                <p className="text-green-500 text-xs">↑ 15% from last month</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <IndianRupeeIcon className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(dashboardData.stats.totalRevenue)}</p>
                <p className="text-green-500 text-xs">↑ 20% from last month</p>
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md p-6 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Lightbulb className="mr-2" size={20} />
                Pending Approvals
              </h2>
              <p className="mb-4">
                You have <span className="font-bold">{dashboardData.stats.pendingTutorApprovals}</span> tutor applications pending review
              </p>
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium" onClick={()=>router.push(`/admin/tutors/tutorapplications`)}>
                Review Applications
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md p-6 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <MessageCircle className="mr-2" size={20} />
                Session Insights
              </h2>
              <p className="mb-4">
                <span className="font-bold">{dashboardData.stats.completedSessions}</span> completed sessions this month
              </p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium" onClick={()=>router.push(`/admin/bookings`)}>
                View Reports
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-orange-400 to-pink-600 rounded-xl shadow-md p-6 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Globe className="mr-2" size={20} />
                Top Languages
              </h2>
              <p className="mb-4">
                {dashboardData.languageStats.slice(0, 3).map(lang => lang.name).join(', ')} are trending
              </p>
              
            </div>
          </div>
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Booking Trends</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.bookingTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            
          </div>
          
          {/* Latest Activity Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Latest Platform Activity</h2>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity, index) => {
                // Determine icon based on activity type
                let IconComponent;
                let bgColor;
                
                switch(activity.type) {
                  case 'user':
                    IconComponent = Users;
                    bgColor = 'bg-green-100';
                    break;
                  case 'tutor':
                    IconComponent = GraduationCap;
                    bgColor = 'bg-blue-100';
                    break;
                  case 'booking':
                    IconComponent = BookOpen;
                    bgColor = 'bg-purple-100';
                    break;
                  case 'payment':
                    IconComponent = IndianRupeeIcon;
                    bgColor = 'bg-yellow-100';
                    break;
                  default:
                    IconComponent = MessageCircle;
                    bgColor = 'bg-gray-100';
                }
                
                return (
                  <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`${bgColor} p-2 rounded-full mr-4`}>
                      <IconComponent size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {dashboardData.recentActivity.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activity found</p>
              )}
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProtectedRoute(AdminDashboard);