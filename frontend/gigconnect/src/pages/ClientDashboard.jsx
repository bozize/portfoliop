import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchClientDataThunk } from '../redux/clientSlice';
import { logout } from '../redux/actions/authActions';

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, status, error } = useSelector((state) => state.client);

  useEffect(() => {
    dispatch(fetchClientDataThunk());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handlePostJob = () => {
    navigate('/post-job');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="client-dashboard">
      <h1>Welcome, {profile.user?.username || profile.company_name || 'Client'}!</h1>
      
      <section className="profile-summary">
        <h2>Profile Summary</h2>
        <p><strong>Company Name:</strong> {profile.company_name || 'Not provided'}</p>
        <p><strong>Website:</strong> {profile.website || 'Not provided'}</p>
        <Link to="/profile">Edit Profile</Link>
      </section>

      <section className="posted-jobs">
        <h2>Your Posted Jobs</h2>
        {/* You'll need to implement a way to fetch and display posted jobs */}
        <p>No jobs posted yet.</p>
        <button onClick={handlePostJob}>Post a New Job</button>
      </section>

      <section className="applications">
        <h2>Recent Applications</h2>
        {/* You'll need to implement a way to fetch and display recent applications */}
        <p>No recent applications.</p>
        <Link to="/applications">View All Applications</Link>
      </section>

      <Link to={`/client/${profile.company_name}`}>View Public Profile</Link>
      
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ClientDashboard;
