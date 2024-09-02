import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { freelancerSignup } from '../redux/actions/authActions';
import { FREELANCER_SIGNUP_RESET } from '../redux/constants/authConstants';

const FreelancerSignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.freelancerSignup);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      // Redirect to login after successful signup
      navigate('/login');
      dispatch({ type: FREELANCER_SIGNUP_RESET }); // Reset the signup state
    }
  }, [success, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(freelancerSignup({ username, password, email }));
  };

  return (
    <div>
      <h2>Freelancer Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>Signup</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default FreelancerSignupPage;
