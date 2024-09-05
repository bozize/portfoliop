// src/App.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { logout } from './redux/actions/authActions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.exp) {
        const currentTime = Date.now() / 1000;
        if (currentTime > userInfo.exp) {
          dispatch(logout());
        }
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

