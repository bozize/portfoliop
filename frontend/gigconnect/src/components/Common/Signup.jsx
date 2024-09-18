import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up for GigConnect</h2>
      <div className="space-y-4">
        <Link
          to="/signup/client"
          className="block w-full py-2 px-4 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition duration-300"
        >
          Join as a Client
        </Link>
        <Link
          to="/signup/freelancer"
          className="block w-full py-2 px-4 bg-green-500 text-white text-center rounded hover:bg-green-600 transition duration-300"
        >
          Join as a Freelancer
        </Link>
      </div>
    </div>
  );
};

export default Signup;