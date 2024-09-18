import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FreelancerItem = ({ freelancer }) => {
  return (
    <div className="border p-4 mb-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{freelancer.user.username}</h3>
      <p className="text-gray-600 mb-2">{freelancer.bio.substring(0, 100)}...</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {freelancer.skills.map(skill => (
          <span key={skill.id} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {skill.name}
          </span>
        ))}
      </div>
      <Link to={`/freelancers/${freelancer.id}`} className="text-blue-600 hover:underline">
        View Profile
      </Link>
    </div>
  );
};

FreelancerItem.propTypes = {
  freelancer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
    bio: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default FreelancerItem;



