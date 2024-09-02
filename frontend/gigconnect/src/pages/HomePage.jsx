// src/pages/HomePage.jsx
import React from 'react';
import Header from '../components/Common/Header';
import Footer from '../components/Common/Footer';
import JobCategoriesList from '../components/Jobs/JobsCat';

const HomePage = () => {
  return (
    <div>
      <Header />
      <JobCategoriesList />
      <main>
        <h1>Welcome to GigConnect</h1>
        {JobCategoriesList}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
