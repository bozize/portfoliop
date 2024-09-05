import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const JobCategoryItem = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (category?.id) {
      navigate(`/categories/${category.id}`);
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
      <h3>{category.name || 'No name available'}</h3>
      <p>{category.description || 'No description available'}</p>
    </div>
  );
};

JobCategoryItem.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default JobCategoryItem;
