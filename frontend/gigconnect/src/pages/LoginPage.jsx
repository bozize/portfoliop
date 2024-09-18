import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../redux/actions/authActions';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector((state) => state.login);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'FREELANCER') {
        navigate('/freelancer-dashboard');
      } else if (userInfo.role === 'CLIENT') {
        navigate('/client-dashboard');
      }
    }
  }, [userInfo, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(userLogin({ username, password }));
  };

  return (
    <div className="loginContainer">
      <h2>Login</h2>
      <form className="loginForm" onSubmit={handleSubmit}>
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