import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchClientDataThunk, updateClientProfileThunk } from '../redux/clientSlice';
import { fetchClientJobs, selectClientJobs, selectClientJobsStatus, selectClientJobsError } from '../redux/jobsSlice';
import { logout } from '../redux/actions/authActions';

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, status, error } = useSelector((state) => state.client);
  const clientJobs = useSelector(selectClientJobs);
  const clientJobsStatus = useSelector(selectClientJobsStatus);
  const clientJobsError = useSelector(selectClientJobsError);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    website: ''
  });

  useEffect(() => {
    dispatch(fetchClientDataThunk());
    dispatch(fetchClientJobs());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || '',
        website: profile.website || ''
      });
    }
  }, [profile]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      company_name: profile.company_name || '',
      website: profile.website || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData); // Debug log
    const resultAction = await dispatch(updateClientProfileThunk(formData));
    if (updateClientProfileThunk.fulfilled.match(resultAction)) {
      setIsEditing(false);
      dispatch(fetchClientDataThunk());
    } else {
      console.error('Profile update failed:', resultAction.payload);
      // You might want to show an error message to the user here
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePostJob = () => {
    navigate('/post-job');
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}/applications`);
  };

  if (status === 'loading' || clientJobsStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed' || clientJobsStatus === 'failed') {
    return <div>Error: {error || clientJobsError}</div>;
  }

  return (
    <div className="client-dashboard">
      <h1>Welcome, {profile.user?.username || 'Client'}!</h1>
      
      <section className="profile-summary">
        <h2>Profile Summary</h2>
        {!isEditing ? (
          <>
            <p><strong>Company Name:</strong> {profile.company_name || 'Not specified'}</p>
            <p><strong>Website:</strong> {profile.website || 'Not specified'}</p>
            <button onClick={handleEditClick}>Edit Profile</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Company Name:
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Website:
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancelEdit}>Cancel</button>
          </form>
        )}
      </section>

      <section className="posted-jobs">
        <h2>Your Posted Jobs</h2>
        {clientJobs.length > 0 ? (
          <ul>
            {clientJobs.map((job) => (
              <li key={job.id} onClick={() => handleJobClick(job.id)}>
                {job.title}
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs posted yet.</p>
        )}
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
