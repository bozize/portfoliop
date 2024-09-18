import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobDetails, selectJobDetails, selectJobStatus, selectJobError, applyForJob, selectApplicationStatus, selectApplicationError } from '../../redux/jobsSlice';

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const jobDetails = useSelector((state) => selectJobDetails(state, id));
  const status = useSelector(selectJobStatus);
  const error = useSelector(selectJobError);
  const applicationStatus = useSelector(selectApplicationStatus);
  const applicationError = useSelector(selectApplicationError);
  const userInfo = useSelector((state) => state.login.userInfo);
  const isFreelancer = userInfo?.role === 'FREELANCER';
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedPay, setProposedPay] = useState('');
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState('');
  const [estimatedCompletionTimeUnit, setEstimatedCompletionTimeUnit] = useState('days');

  useEffect(() => {
    if (!jobDetails) {
      dispatch(fetchJobDetails(id));
    }
  }, [dispatch, id, jobDetails]);

  const handleApplyClick = () => {
    console.log('User Info:', userInfo);
    console.log('Is Freelancer:', isFreelancer);
    if (isFreelancer) {
      setShowApplicationForm(true);
    } else {
      alert('Only freelancers can apply for jobs');
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (isFreelancer) {
      try {
        await dispatch(applyForJob({
          jobId: id,
          coverLetter,
          proposedPay,
          estimatedCompletionTime: parseInt(estimatedCompletionTime, 10),
          estimatedCompletionTimeUnit,
          status: 'pending'
        })).unwrap();
        alert('Application submitted successfully!');
        setShowApplicationForm(false);
      } catch (err) {
        console.error('Application submission error:', err);
        alert(`Failed to submit application: ${err.message || 'Please try again.'}`);
      }
    } else {
      alert('Only freelancers can submit an application');
    }
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (!jobDetails) return <div>Job not found</div>;

  return (
    <div>
      <h1>{jobDetails.title || 'Untitled Job'}</h1>
      <p>{jobDetails.description || 'No description available'}</p>
      <p>Pay: ${jobDetails.pay || 'N/A'}</p>
      <p>Category: {jobDetails.category || 'Uncategorized'}</p>
      <p>Required Skills: {jobDetails.required_skills && Array.isArray(jobDetails.required_skills) 
          ? jobDetails.required_skills.join(', ') 
          : 'No skills specified'}</p>
      <p>Posted by: {jobDetails.client || 'Unknown'}</p>
      <p>Posted on: {jobDetails.created_at 
          ? new Date(jobDetails.created_at).toLocaleDateString() 
          : 'Unknown date'}</p>
      
      {!showApplicationForm && (
        <button onClick={handleApplyClick}>Apply for this job</button>
      )}

      {showApplicationForm && (
        <form onSubmit={handleSubmitApplication}>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Cover Letter"
            required
          />
          <input
            type="number"
            value={proposedPay}
            onChange={(e) => setProposedPay(e.target.value)}
            placeholder="Proposed Pay"
            required
          />
          <div>
            <input
              type="number"
              value={estimatedCompletionTime}
              onChange={(e) => setEstimatedCompletionTime(e.target.value)}
              placeholder="Estimated Completion Time"
              required
              min="1"
            />
            <select
              value={estimatedCompletionTimeUnit}
              onChange={(e) => setEstimatedCompletionTimeUnit(e.target.value)}
              required
            >
              <option value="days">Days</option>
              <option value="months">Months</option>
            </select>
          </div>
          <button type="submit" disabled={applicationStatus === 'loading'}>
            {applicationStatus === 'loading' ? 'Submitting...' : 'Submit Application'}
          </button>
          {applicationStatus === 'failed' && <p>Error: {applicationError}</p>}
        </form>
      )}
    </div>
  );
};

export default JobDetails;
