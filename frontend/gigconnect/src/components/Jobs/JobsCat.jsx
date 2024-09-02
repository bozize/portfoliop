import React, { useEffect } from 'react';
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

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = jobCategories.map((category) => (
      <JobCategoryItem key={category.id} category={category} />
    ));
  } else if (status === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>Job Categories</h2>
      {content}
    </section>
  );
};

export default JobCategoriesList;
