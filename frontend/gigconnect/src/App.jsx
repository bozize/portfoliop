// src/App.jsx
import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { logout, setCredentials } from './redux/actions/authActions';
import * as jwtDecode from 'jwt-decode';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decodedToken = jwtDecode.jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp > currentTime) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            dispatch(setCredentials({
              token: token,
              user: {...userInfo, token: token}
            }));
          } else {
            dispatch(logout());
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          dispatch(logout());
        }
      }
    };

    initializeAuth();
    const intervalId = setInterval(initializeAuth, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

