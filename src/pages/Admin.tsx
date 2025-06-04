
import React from 'react';
import Navbar from '@/components/Navbar';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/context/AuthContext';
import VideoManagement from '@/components/admin/VideoManagement';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

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
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="section-padding py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </main>
      </div>
    );
  }

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
