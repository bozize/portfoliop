import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createJobThunk } from '../redux/jobsSlice';
import { 
  getJobCategories, 
  getSkills,
  selectAllJobCategories, 
  selectAllSkills,
  selectJobCategoriesStatus, 
  selectJobCategoriesError,
  selectSkillStatus,
  selectSkillError
} from '../redux/jobcatSlice';

const JobPostPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    pay: '',
    category: '',
    required_skills: [],
  });

  const jobCategories = useSelector(selectAllJobCategories);
  const skills = useSelector(selectAllSkills);
  const jobCategoriesStatus = useSelector(selectJobCategoriesStatus);
  const jobCategoriesError = useSelector(selectJobCategoriesError);
  const skillStatus = useSelector(selectSkillStatus);
  const skillError = useSelector(selectSkillError);
  const { createJobStatus, createJobError } = useSelector((state) => state.jobs || {});

  useEffect(() => {
    if (jobCategoriesStatus === 'idle' || jobCategories.length === 0) {
      dispatch(getJobCategories());
    }
    if (skillStatus === 'idle' || skills.length === 0) {
      dispatch(getSkills());
    }
  }, [jobCategoriesStatus, skillStatus, jobCategories.length, skills.length, dispatch]);


  
  useEffect(() => {
    if (createJobStatus === 'succeeded') {
      console.log('Job posted successfully!');
      navigate('/client-dashboard');
    } else if (createJobStatus === 'failed') {
      console.error('Failed to post job:', createJobError);
      
    }
  }, [createJobStatus, createJobError, navigate]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSkillChange = (e) => {
    const selectedSkills = Array.from(e.target.selectedOptions, option => option.value);
    setJobData({ ...jobData, required_skills: selectedSkills });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createJobThunk(jobData));
  };

  if (jobCategoriesStatus === 'loading' || skillStatus === 'loading') return <div>Loading...</div>;
  if (jobCategoriesError) return <div>Error loading job categories: {jobCategoriesError}</div>;
  if (skillError) return <div>Error loading skills: {skillError}</div>;

  return (
    <div className="job-post-page">
      <h1>Post a New Job</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Job Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Job Description:</label>
          <textarea
            id="description"
            name="description"
            value={jobData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="pay">Budget:</label>
          <input
            type="number"
            id="pay"
            name="pay"
            value={jobData.pay}
            onChange={handleChange}
            required
          />
        </div>
        <div>
  <label htmlFor="level_of_expertise">Level of Expertise:</label>
  <select
    id="level_of_expertise"
    name="level_of_expertise"
    value={jobData.level_of_expertise}
    onChange={handleChange}
    required
  >
    <option value="">Select a level</option>
    <option value="Entry">Entry</option>
    <option value="Intermediate">Intermediate</option>
    <option value="Expert">Expert</option>
  </select>
</div>
        <div>
          <label htmlFor="category">Job Category:</label>
          <select
            id="category"
            name="category"
            value={jobData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {jobCategories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="required_skills">Required Skills:</label>
          <select
            id="required_skills"
            name="required_skills"
            multiple
            value={jobData.required_skills}
            onChange={handleSkillChange}
            required
          >
            {skills.map((skill) => (
              <option key={skill.id} value={skill.id}>{skill.name}</option>
            ))}
          </select>
        </div>
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default JobPostPage;
