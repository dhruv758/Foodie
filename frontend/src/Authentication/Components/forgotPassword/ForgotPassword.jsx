import React, { useEffect, useState } from "react";
import SetEmail from "./setEmail"
import NewPassword from "./NewPassword";
import VerifyOtp from "./verifyOtp";

export default function ForgotPassword () {
  const [currentScreen, setCurrentScreen] = useState("forgotPassword");
  const [email , setEmail] = useState("");


  // Function to handle screen changes
  const handleScreenChange = (screen) => {
    setCurrentScreen(screen);
    console.log("click");
    console.log(currentScreen);
  };

  const handleSetEmailId = (email)=>{
    setEmail(email);
  }

  useEffect(()=>{
    console.log("Current Screen:", currentScreen);
  },[currentScreen])

  return (
    <>
      {currentScreen === "forgotPassword" && (
        <SetEmail
          onForgotButtonClick={() => handleScreenChange("verifyOtp") }
          setEmailid = {handleSetEmailId} 
        />
      )}
       {currentScreen === "verifyOtp" && (
        <VerifyOtp
          onForgotButtonClick={() => handleScreenChange("NewPassword")}
          email = {email}
        />
      )}
      {currentScreen === "NewPassword" && (
        <NewPassword  email={email} />
      )}
     
    </>
      
  );
}
