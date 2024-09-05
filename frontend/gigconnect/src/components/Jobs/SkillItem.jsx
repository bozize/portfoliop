import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const SkillItem = ({ skill }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (skill?.id) {
      navigate(`/skills/${skill.id}`);
    }
  };

  return (
    <div 
      onClick={handleClick} 
      onKeyPress={(e) => { if (e.key === 'Enter') handleClick(); }}
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '1rem' }}
    >
      <h3>{skill.name || 'No name available'}</h3>
      <p>{skill.description || 'No description available'}</p>
    </div>
  );
};

SkillItem.propTypes = {
  skill: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default SkillItem;




