import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, fetchJobsFiltered } from '../../redux/jobsSlice';
import { getJobCategories, getSkills } from '../../redux/jobcatSlice';
import JobItem from './JobItem';

const JobListings = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(state => state.jobs.jobs);
  const jobCategories = useSelector(state => state.jobCategories.categories);
  const skills = useSelector(state => state.jobCategories.skills);
  const status = useSelector(state => state.jobs.status);
  const error = useSelector(state => state.jobs.error);

  const [filters, setFilters] = useState({
    category: '',
    skill: '',
    minPay: '',
    maxPay: ''
  });

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(getJobCategories());
    dispatch(getSkills());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const applyFilters = () => {
    dispatch(fetchJobsFiltered(filters));
  };

  if (status === 'loading') {
    return <div>Loading jobs...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error && typeof error === 'object' ? JSON.stringify(error) : error}</div>;
  }

  return (
    <div className="job-listings">
      <h2>Job Listings</h2>
      
      <div className="filters">
        <select name="category" onChange={handleFilterChange} value={filters.category}>
          <option value="">All Categories</option>
          {jobCategories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        
        <select name="skill" onChange={handleFilterChange} value={filters.skill}>
          <option value="">All Skills</option>
          {skills.map(skill => (
            <option key={skill.id} value={skill.id}>{skill.name}</option>
          ))}
        </select>
        
        <input
          type="number"
          name="minPay"
          placeholder="Min Pay"
          onChange={handleFilterChange}
          value={filters.minPay}
        />
        
        <input
          type="number"
          name="maxPay"
          placeholder="Max Pay"
          onChange={handleFilterChange}
          value={filters.maxPay}
        />
        
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      <div className="job-list">
        {Array.isArray(jobs) && jobs.length > 0 ? (
          jobs.map(job => <JobItem key={job.id} job={job} />)
        ) : (
          <div>No jobs available</div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
