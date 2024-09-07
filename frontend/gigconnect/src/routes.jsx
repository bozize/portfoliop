
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ClientSignupPage from './pages/ClientSignupPage';
import FreelancerSignupPage from './pages/FreelancerSignupPage';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import JobCategoriesList from './components/Jobs/JobsCat';
import JobCategoryDetail from './components/Jobs/JobCatDetail';
import SkillDetail from './components/Jobs/SkillDetail';
import JobPostPage from './pages/JobPostPage';
import JobListings from './components/Jobs/JobListings';
import JobDetails from './components/Jobs/JobDetails';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import JobApplications from './components/Jobs/JobApplications';

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/client" element={<ClientSignupPage />} />
        <Route path="/signup/freelancer" element={<FreelancerSignupPage />} />
        
        <Route path="/client-dashboard" element={
          <PrivateRoute requiredRole="CLIENT">
            <ClientDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/freelancer-dashboard" element={
          <PrivateRoute requiredRole="FREELANCER">
            <FreelancerDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/categories" element={<JobCategoriesList />} />
        <Route path="/categories/:id" element={<JobCategoryDetail />} />
        <Route path="/skills/:id" element={<SkillDetail />} />
        
        <Route path="/post-job" element={
          <PrivateRoute requiredRole="CLIENT">
            <JobPostPage />
          </PrivateRoute>
        } />
        
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        
        <Route path="/jobs/:jobId/applications" element={<JobApplications />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;

