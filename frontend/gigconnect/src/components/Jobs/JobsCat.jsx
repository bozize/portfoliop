import  { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getJobCategories, selectAllJobCategories, selectJobCategoriesStatus, selectJobCategoriesError } from '../../redux/jobcatSlice';
import JobCategoryItem from './JobCatItem';

const JobCategoriesList = () => {
  const dispatch = useDispatch();
  const jobCategories = useSelector(selectAllJobCategories);
  const status = useSelector(selectJobCategoriesStatus);
  const error = useSelector(selectJobCategoriesError);


  useEffect(() => {
    if (status === 'idle') {
      dispatch(getJobCategories());
    }
  }, [status, dispatch]);


  if (status === 'loading') {
    return <p>Loading...</p>;
  }


  if (status === 'failed') {
    return <p>{error}</p>;
  }


  return (
    <section>
      <h2>Job Categories</h2>
      {jobCategories.length > 0 ? (
        jobCategories.map((category) => (
          <JobCategoryItem key={category.id} category={category} />
        ))
      ) : (
        <p>No job categories available.</p>
      )}
    </section>
  );
};


export default JobCategoriesList;
