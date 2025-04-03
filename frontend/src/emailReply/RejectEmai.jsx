import React from "react";
import { useSearchParams } from "react-router-dom";

const EmailApproval = () => {

    const [searchParams] = useSearchParams();
    const email = searchParams.get("user"); // Extract email from URL query params
    const decodedEmail = decodeURIComponent(email || ""); // Decode and handle null case
       
    console.log("Extracted Email:", decodedEmail);

    

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-md text-center shadow-lg bg-white rounded-2xl">
        
        <h2 className="text-xl font-semibold">Email Rejected!</h2>
        <p className="text-gray-700 mt-2">The email <strong>{email}</strong> has been approved.</p>
        <p className="text-gray-600 mt-2">The person can now login, and a confirmation email has been sent.</p>
      </div>
    </div>
  );
};

export default EmailApproval;
