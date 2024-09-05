import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchFreelancerDataThunk } from '../redux/freelancerSlice';
import { logout } from '../redux/actions/authActions';

const FreelancerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, status, error } = useSelector((state) => state.freelancer);

  useEffect(() => {
    dispatch(fetchFreelancerDataThunk());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="freelancer-dashboard">
      <h1>Welcome, {profile.user?.username || 'Freelancer'}!</h1>
      
      <section className="profile-summary">
        <h2>Profile Summary</h2>
        <p><strong>Bio:</strong> {profile.bio || 'No bio available'}</p>
        <p><strong>Skills:</strong> {profile.skills?.map(skill => skill.name).join(', ') || 'No skills listed'}</p>
        <Link to="/profilef">Edit Profile</Link>
      </section>

      <section className="job-applications">
        <h2>Your Job Applications</h2>
        {/* You'll need to implement a way to fetch and display job applications */}
        <p>No job applications yet.</p>
      </section>

      <section className="available-jobs">
        <h2>Available Jobs</h2>
        {/* You'll need to implement a way to fetch and display available jobs */}
        <p>No jobs available at the moment.</p>
        <Link to="/jobs">Browse All Jobs</Link>
      </section>

      <section className="earnings">
        <h2>Earnings</h2>
        {/* You'll need to implement a way to fetch and display earnings */}
        <p>Total Earnings: $0</p>
      </section>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default FreelancerDashboard;
