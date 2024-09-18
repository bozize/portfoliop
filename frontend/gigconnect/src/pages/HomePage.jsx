// src/pages/HomePage.jsx

// src/pages/HomePage.jsx

import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer';
import JobCategoriesList from '../components/Jobs/JobsCat';
import { logout } from '../redux/actions/authActions';
import { useDispatch } from 'react-redux';
import {  useNavigate } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };


  return (
    <div>
      <Header />
      
    
      <main>
        <h1>Welcome to GigConnect</h1>
        <JobCategoriesList />
      </main>
      <button onClick={handleLogout}>Logout</button>
      <Footer />
    </div>
  );
};

export default HomePage;
