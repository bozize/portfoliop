import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const JobItem = ({ job }) => {
  if (!job) {
    return null; // or return a placeholder component
  }

  const renderSkills = (skills) => {
    if (!skills || skills.length === 0) return 'None specified';
    return skills.map(skill => typeof skill === 'object' ? skill.name : skill).join(', ');
  };

  const renderCategory = (category) => {
    if (typeof category === 'object' && category !== null) {
      return category.name;
    } else if (typeof category === 'string') {
      return category;
    }
    return 'Uncategorized';
  };

  return (
    <div className="job-item">
      <h3>{job.title || 'Untitled Job'}</h3>
      <p className="job-description">{(job.description && job.description.substring(0, 100)) || 'No description available'}...</p>
      <div className="job-details">
        <span className="job-pay">Pay: ${parseFloat(job.pay) || 'N/A'}</span>
        <span className="job-category">Category: {renderCategory(job.category)}</span>
      </div>
      <div className="job-skills">
        <strong>Required Skills:</strong> {renderSkills(job.required_skills)}
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
    pay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Allow both string and number
    category: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
      })
    ]),
    required_skills: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string
        })
      ])
    )
  }).isRequired
};

export default JobItem;
