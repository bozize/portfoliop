import { useEffect, useState } from 'react';
import { useParams, } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobCategoryDetails } from '../../apis/jobcatAPI';
import { filteredFreelancers } from '../../redux/freelancerSlice';
import FreelancerItem from './FreelancerItem';

const JobCategoryDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [jobCategoryDetails, setJobCategoryDetails] = useState(null);
  const [error, setError] = useState(null);
  const { filteredFreelancers: freelancers, status: freelancersStatus } = useSelector(state => state.freelancer);

  useEffect(() => {
    const getJobCategoryDetails = async () => {
      try {
        const data = await fetchJobCategoryDetails(id);
        setJobCategoryDetails(data);
        dispatch(filteredFreelancers(id));
      } catch (error) {
        setError('No job category details available.');
      }
    };

    if (id && id !== 'undefined') {
      getJobCategoryDetails();
    } else {
      setError('Invalid job category ID.');
    }
  }, [id, dispatch]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!jobCategoryDetails || freelancersStatus === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{jobCategoryDetails.name}</h2>
      <p className="mb-4">{jobCategoryDetails.description}</p>
      
      <h3 className="text-xl font-semibold mb-4">Freelancers in this Category</h3>
      {freelancers && freelancers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {freelancers.map(freelancer => (
            <FreelancerItem key={freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      ) : (
        <p>No freelancers available for this category.</p>
      )}
    </section>
  );
};

export default JobCategoryDetail;












