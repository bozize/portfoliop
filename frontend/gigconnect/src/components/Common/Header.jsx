// src/components/Common/Header.jsx
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup/client">Join as Client</Link></li>
          <li><Link to="/signup/freelancer">Join as Freelancer</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
