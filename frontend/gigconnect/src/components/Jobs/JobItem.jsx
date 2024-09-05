
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const JobItem = ({ job }) => {
  if (!job) {
    return null; // or return a placeholder component
  }

  return (
    <div className="job-item">
      <h3>{job.title || 'Untitled Job'}</h3>
      <p className="job-description">{(job.description && job.description.substring(0, 100)) || 'No description available'}...</p>
      <div className="job-details">
        <span className="job-pay">Pay: ${job.pay || 'N/A'}</span>
        <span className="job-category">Category: {job.category?.name || 'Uncategorized'}</span>
      </div>
      <div className="job-skills">
        <strong>Required Skills:</strong> {job.required_skills?.map(skill => skill.name).join(', ') || 'None specified'}
      </div>
      <Link to={`/jobs/${job.id}`} className="view-job-btn">View Details</Link>
    </div>
  );
};

JobItem.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    pay: PropTypes.number,
    category: PropTypes.shape({
      name: PropTypes.string
    }),
    required_skills: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string
      })
    )
  }).isRequired
};

export default JobItem;
