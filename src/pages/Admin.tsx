
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/context/AuthContext';
import VideoManagement from '@/components/admin/VideoManagement';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  // Add debugging logs
  useEffect(() => {
    console.log('Admin page - Auth loading:', authLoading);
    console.log('Admin page - Role loading:', roleLoading);
    console.log('Admin page - User:', user?.id);
    console.log('Admin page - Is admin:', isAdmin);
  }, [authLoading, roleLoading, user, isAdmin]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="section-padding py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    console.log('Admin page: No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    console.log('Admin page: User is not admin, showing access denied');
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="section-padding py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
            <p className="text-sm text-gray-500 mt-2">User ID: {user.id}</p>
            <p className="text-sm text-gray-500">Email: {user.email}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </main>
      </div>
    );
  }

  console.log('Admin page: User has admin access, showing admin panel');
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="section-padding py-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage videos and content for the video library</p>
        </div>

        <VideoManagement />
      </main>
    </div>
  );
};

export default Admin;
