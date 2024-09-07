import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSkillDetails } from '../../apis/jobcatAPI';

const SkillDetail = () => {
  const { id } = useParams();
  const [skillDetails, setSkillDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSkillDetails = async () => {
      try {
        const data = await fetchSkillDetails(id);
        setSkillDetails(data);
      } catch (error) {
        setError('No skill details available.');
      }
    };

    getSkillDetails();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!skillDetails) {
    return <div>Loading...</div>;
  }

  const { skill = {}, freelancers = [] } = skillDetails;

  return (
    <div>
      <h1>{skill.name || 'No name available'}</h1>
      <section>
        <h2>Freelancers</h2>
        {freelancers.length > 0 ? (
          <ul>
            {freelancers.map(freelancer => (
              <li key={freelancer.id}>{freelancer.username}</li>
            ))}
          </ul>
        ) : (
          <p>No freelancers available</p>
        )}
      </section>
    </div>
  );
};

export default SkillDetail;

