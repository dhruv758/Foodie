// ProtectedLayout.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const authData = localStorage.getItem('auth'); // your auth logic
       // Parse and validate
    let isAuthenticated = false;
    try {
       const parsed = JSON.parse(authData);
       isAuthenticated = parsed?.email && parsed?.token;
    } catch (e) {
           isAuthenticated = false;
    }
   
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;