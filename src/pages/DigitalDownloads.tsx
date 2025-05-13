
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDigitalDownloads } from "@/hooks/useDigitalDownloads";
import DownloadsList from "@/components/downloads/DownloadsList";
import AuthRequiredMessage from "@/components/downloads/AuthRequiredMessage";
import UserInfoDisplay from "@/components/downloads/UserInfoDisplay";

const DigitalDownloads = () => {
  const { user, downloads, loading, handleDownload, handleSignOut } = useDigitalDownloads();
  const navigate = useNavigate();

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Your Digital Downloads</h1>
            <AuthRequiredMessage onLoginClick={() => navigate("/login")} />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <UserInfoDisplay 
            email={user.email} 
            onSignOut={handleSignOut} 
          />
          
          <DownloadsList
            downloads={downloads}
            loading={loading}
            onDownload={handleDownload}
            onShopNow={() => navigate("/shop")}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DigitalDownloads;
