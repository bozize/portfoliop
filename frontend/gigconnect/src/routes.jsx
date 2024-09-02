// src/routes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ClientSignupPage from './pages/ClientSignupPage';
import FreelancerSignupPage from './pages/FreelancerSignupPage';
import ClientPage from './pages/ClientPage';
import FreelancerPage from './pages/FreelancerPage';
import ClientDashboard from './components/Client/ClientDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup/client" element={<ClientSignupPage />} />
      <Route path="/signup/freelancer" element={<FreelancerSignupPage />} />
      <Route path="/client" element={<ClientPage />} />
      <Route path="/freelancer" element={<FreelancerPage />} />
      <Route path="/client-dashboard" element={<ClientDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
