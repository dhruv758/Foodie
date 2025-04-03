import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const EmailApproval = () => {


    const [searchParams] = useSearchParams();
    const email = searchParams.get("user"); // Extract email from URL query params
    const decodedEmail = decodeURIComponent(email || ""); // Decode and handle null case
  
    console.log("Extracted Email:", decodedEmail);



    const handle =async (email) => {
        try {
            console.log(email);
            const response = await fetch("http://localhost:3000/registration-approved", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email}),
            });
        
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
        
            const data = await response.json();
            console.log("Search request successful in zomato api:", data);

          } catch (error) {
            console.error("There was an error during the search request:", error);
            throw error; // Re-throw to handle error at call site
          }
    }



    useEffect(()=>{
        handle(decodedEmail);
    },[])



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-md text-center shadow-lg bg-white rounded-2xl">
       
        <h2 className="text-xl font-semibold">Email Accepted!</h2>
        <p className="text-gray-700 mt-2">The email <strong>{email}</strong> has been approved.</p>
        <p className="text-gray-600 mt-2">The person can now login, and a confirmation email has been sent.</p>
      </div>
    </div>
  );
};

export default EmailApproval;
