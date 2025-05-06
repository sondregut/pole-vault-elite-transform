
import React from 'react';

interface ErrorStateProps {
  message: string;
  subMessage?: string;
  icon?: string;
  iconClass?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message, 
  subMessage = "Please verify that your Printful API key is correctly configured in Supabase and that you have products set up in your Printful store.",
  icon = "ri-error-warning-line",
  iconClass = "text-red-500"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <div className={`${iconClass} mb-4 text-xl`}>
        <i className={`${icon} text-3xl`}></i>
      </div>
      <h3 className="font-semibold text-lg mb-2">{message}</h3>
      <p className="text-gray-500 mb-6">{subMessage}</p>
    </div>
  );
};

export default ErrorState;
