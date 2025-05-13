
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface UserInfoDisplayProps {
  email: string;
  onSignOut: () => Promise<void>;
}

const UserInfoDisplay: React.FC<UserInfoDisplayProps> = ({ email, onSignOut }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Digital Downloads</h1>
        <Button variant="outline" onClick={onSignOut} className="flex gap-2 items-center">
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p className="font-medium">Signed in as: <span className="text-primary">{email}</span></p>
      </div>
    </>
  );
};

export default UserInfoDisplay;
