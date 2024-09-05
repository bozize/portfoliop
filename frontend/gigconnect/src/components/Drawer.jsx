import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button className="drawer-toggle" onClick={toggleDrawer}>
        ☰
      </button>
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={toggleDrawer}>
          &times;
        </button>
        <nav className="drawer-nav">
          <Link to="/login" onClick={closeDrawer}>Login</Link>
          <Link to="/jobs" onClick={closeDrawer}>Find Gig</Link>
          <Link to="/freelancers" onClick={closeDrawer}>Find Freelancers</Link>
        </nav>
      </div>
      {isOpen && <div className="drawer-backdrop" onClick={toggleDrawer}></div>}
    </>
  );
};

export default Drawer;
