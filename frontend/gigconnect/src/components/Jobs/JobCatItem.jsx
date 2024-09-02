import React from 'react';

const JobCategoryItem = ({ category }) => {
  return (
    <div>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
    </div>
  );
};

export default JobCategoryItem;
