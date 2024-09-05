import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobCategoryDetails } from '../../apis/jobcatAPI';

const JobCategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobCategoryDetails, setJobCategoryDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getJobCategoryDetails = async () => {
      try {
        const data = await fetchJobCategoryDetails(id);
        setJobCategoryDetails(data);
      } catch (error) {
        setError('No job category details available.');
      }
    };

    getJobCategoryDetails();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!jobCategoryDetails) {
    return <div>Loading...</div>;
  }

  const { job_category = {}, skills = [], freelancers = [] } = jobCategoryDetails;

  const handleSkillClick = (skillId) => {
    navigate(`/skills/${skillId}/`);
  };

  return (
    <div>
      <h1>{job_category.name || 'No name available'}</h1>
      <section>
        <h2>Skills</h2>
        {skills.length > 0 ? (
          <ul>
            {skills.map(skill => (
              <li key={skill.id} onClick={() => handleSkillClick(skill.id)} style={{ cursor: 'pointer' }}>
                {skill.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No skills available</p>
        )}
      </section>
      <section>
        <h2>Freelancers</h2>
        {freelancers.length > 0 ? (
          <ul>
            {freelancers.map(freelancer => <li key={freelancer.id}>{freelancer.name}</li>)}
          </ul>
        ) : (
          <p>No freelancers available</p>
        )}
      </section>
    </div>
  );
};

export default JobCategoryDetail;
