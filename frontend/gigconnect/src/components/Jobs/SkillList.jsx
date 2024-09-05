import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSkills, selectAllSkills, selectSkillStatus, selectSkillError } from '../../redux/jobcatSlice';
import SkillItem from './SkillItem';

const SkillList = () => {
  const dispatch = useDispatch();
  const skills = useSelector(selectAllSkills);
  const status = useSelector(selectSkillStatus);
  const error = useSelector(selectSkillError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getSkills());
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
      <h2>Skills</h2>
      {skills.length > 0 ? (
        skills.map((skill) => (
          <SkillItem key={skill.id} skill={skill} />
        ))
      ) : (
        <p>No skills available.</p>
      )}
    </section>
  );
};

export default SkillList;


