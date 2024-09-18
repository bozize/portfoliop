import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchFreelancerDataThunk, updateFreelancerProfile, fetchSkillsThunk, fetchJobCategoriesThunk } from '../redux/freelancerSlice';
import { fetchFreelancerJobApplications, selectFreelancerJobApplications, selectFreelancerJobApplicationsStatus, selectFreelancerJobApplicationsError } from '../redux/jobsSlice';
import { logout } from '../redux/actions/authActions';

const FreelancerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, status, error, availableSkills, availableJobCategories } = useSelector((state) => state.freelancer);
  const freelancerJobApplications = useSelector(selectFreelancerJobApplications);
  const freelancerJobApplicationsStatus = useSelector(selectFreelancerJobApplicationsStatus);
  const freelancerJobApplicationsError = useSelector(selectFreelancerJobApplicationsError);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    skills: [],
    jobCategories: []
  });

  const updateFormData = useCallback(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        skills: profile.skills?.map(skill => skill.id) || [],
        jobCategories: profile.job_categories?.map(category => category.id) || []
      });
    }
  }, [profile]);

  useEffect(() => {
    console.log('Fetching freelancer data...');
    dispatch(fetchFreelancerDataThunk());
    dispatch(fetchSkillsThunk());
    dispatch(fetchJobCategoriesThunk());
    dispatch(fetchFreelancerJobApplications());
  }, [dispatch]);

  useEffect(() => {
    console.log('Profile updated:', profile);
    updateFormData();
  }, [profile, updateFormData]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    updateFormData();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    updateFormData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      bio: formData.bio,
      skills: formData.skills,
      job_categories: formData.jobCategories
    };
    console.log('Submitting form data:', updatedFormData);
    try {
      const resultAction = await dispatch(updateFreelancerProfile(updatedFormData));
      console.log('Update result:', resultAction);
      if (updateFreelancerProfile.fulfilled.match(resultAction)) {
        console.log('Profile updated successfully');
        setIsEditing(false);
        dispatch(fetchFreelancerDataThunk());
      } else {
        console.error('Profile update failed:', resultAction.error);
        throw new Error('Profile update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === 'select-multiple') {
      const values = Array.from(selectedOptions, option => parseInt(option.value, 10));
      setFormData(prevData => ({
        ...prevData,
        [name]: values
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  console.log('Current form data:', formData);
  console.log('Current profile:', profile);

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
        {!isEditing ? (
          <>
            <p><strong>Bio:</strong> {profile.bio || 'No bio available'}</p>
            <p><strong>Skills:</strong> {profile.skills?.map(skill => skill.name).join(', ') || 'No skills listed'}</p>
            <p><strong>Job Categories:</strong> {profile.job_categories?.map(category => category.name).join(', ') || 'No categories listed'}</p>
            <button onClick={handleEditClick}>Edit Profile</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Bio:
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </label>
            <label>
              Skills:
              <select multiple name="skills" value={formData.skills} onChange={handleChange}>
                {availableSkills.map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Job Categories:
              <select multiple name="jobCategories" value={formData.jobCategories} onChange={handleChange}>
                {availableJobCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancelEdit}>Cancel</button>
          </form>
        )}
      </section>

      <section className="job-applications">
        <h2>Your Job Applications</h2>
        {freelancerJobApplicationsStatus === 'loading' && <p>Loading job applications...</p>}
        {freelancerJobApplicationsStatus === 'failed' && <p>Error: {freelancerJobApplicationsError}</p>}
        {freelancerJobApplicationsStatus === 'succeeded' && (
          freelancerJobApplications.length > 0 ? (
            <ul>
              {freelancerJobApplications.map((application) => (
                <li key={application.id}>
                  <h3>{application.job_title}</h3>
                  <p>Status: {application.status}</p>
                  <p>Proposed Pay: ${application.proposed_pay}</p>
                  <p>Estimated Completion Time: {application.estimated_completion_time}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No job applications yet.</p>
          )
        )}
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