import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchFilteredFreelancers } from '../../redux/slices/freelancerSlice';
import FreelancerItem from './FreelancerItem';

const FilteredFreelancerList = ({ skill, category }) => {
  const dispatch = useDispatch();
  const { filteredFreelancers, status, error } = useSelector((state) => state.freelancers);

  useEffect(() => {
    dispatch(fetchFilteredFreelancers({ skill, category }));
  }, [dispatch, skill, category]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredFreelancers.length > 0 ? (
        filteredFreelancers.map((freelancer) => (
          <FreelancerItem key={freelancer.id} freelancer={freelancer} />
        ))
      ) : (
        <p>No freelancers found matching the criteria.</p>
      )}
    </div>
  );
};

FilteredFreelancerList.propTypes = {
  skill: PropTypes.string,
  category: PropTypes.string,
};

FilteredFreelancerList.defaultProps = {
  skill: null,
  category: null,
};

export default FilteredFreelancerList;
