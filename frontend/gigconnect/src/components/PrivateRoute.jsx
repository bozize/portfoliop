
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children, requiredRole }) => {
  const { userInfo } = useSelector((state) => state.login);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userInfo.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string
};

export default PrivateRoute;
