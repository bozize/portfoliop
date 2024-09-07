import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobApplications, selectJobApplications, selectJobApplicationsStatus, selectJobApplicationsError } from '../../redux/jobsSlice';

const JobApplications = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const applications = useSelector(selectJobApplications);
  const status = useSelector(selectJobApplicationsStatus);
  const error = useSelector(selectJobApplicationsError);

  useEffect(() => {
    dispatch(fetchJobApplications(jobId));
  }, [dispatch, jobId]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Job Applications</h1>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul>
          {applications.map((application) => (
            <li key={application.id}>
              <p><strong>Applicant:</strong> {application.user.username}</p>
              <p><strong>Cover Letter:</strong> {application.cover_letter}</p>
              <p><strong>Proposed Pay:</strong> ${application.proposed_pay}</p>
              <p><strong>Estimated Completion Time:</strong> {application.estimated_completion_time}</p>
              <p><strong>Status:</strong> {application.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobApplications;
