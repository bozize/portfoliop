import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '../redux/actions/authActions';
import { getJobCategories, getSkills } from '../redux/jobcatSlice';

function AuthWrapper({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
    dispatch(getJobCategories());
    dispatch(getSkills());
  }, [dispatch]);

  return <>{children}</>;
}

export default AuthWrapper;
