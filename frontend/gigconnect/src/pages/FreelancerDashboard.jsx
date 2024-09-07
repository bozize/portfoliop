import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchFreelancerDataThunk, updateFreelancerProfileThunk, fetchSkillsThunk, fetchJobCategoriesThunk } from '../redux/freelancerSlice';
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

  useEffect(() => {
    dispatch(fetchFreelancerDataThunk());
    dispatch(fetchSkillsThunk());
    dispatch(fetchJobCategoriesThunk());
    dispatch(fetchFreelancerJobApplications());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        skills: profile.skills?.map(skill => skill.id) || [],
        jobCategories: profile.job_categories?.map(category => category.id) || []
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
      bio: profile.bio || '',
      skills: profile.skills?.map(skill => skill.id) || [],
      jobCategories: profile.job_categories?.map(category => category.id) || []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      skills: formData.skills.map(skill => typeof skill === 'object' ? skill.id : skill),
      jobCategories: formData.jobCategories.map(category => typeof category === 'object' ? category.id : category)
    };
    console.log('Submitting form data:', updatedFormData); // Debug log
    const resultAction = await dispatch(updateFreelancerProfileThunk(updatedFormData));
    if (updateFreelancerProfileThunk.fulfilled.match(resultAction)) {
      setIsEditing(false);
      dispatch(fetchFreelancerDataThunk());
    } else {
      console.error('Profile update failed:', resultAction.payload);
      // You might want to show an error message to the user here
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'skills' || name === 'jobCategories') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
      setFormData(prevData => ({
        ...prevData,
        [name]: selectedOptions
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
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
                  <h3>{application.job.title}</h3>
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
