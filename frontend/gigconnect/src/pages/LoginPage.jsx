import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../redux/actions/authActions';
import { USER_LOGIN_RESET } from '../redux/constants/authConstants';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Update this line to match the store setup
    const userLoginState = useSelector((state) => state.login || {});
    const { loading, error, userInfo, success } = userLoginState;

    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(userLogin({ username, password }));
    };

    useEffect(() => {
      console.log('User info:', userInfo); // Debugging line
      if (success && userInfo) {
        const role = userInfo.role;

        if (role === 'CLIENT') {
          navigate('/client');
        } else if (role === 'FREELANCER') {
          navigate('/freelancer');
        }

        dispatch({ type: USER_LOGIN_RESET }); // Reset login state after navigating
      }
    }, [success, userInfo, navigate, dispatch]);

    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            Login
          </button>
          {error && <p>{error}</p>}
        </form>
      </div>
    );
};

export default LoginPage;



  