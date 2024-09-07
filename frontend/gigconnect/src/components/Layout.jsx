
import PropTypes from 'prop-types';
import Drawer from './Drawer';

const Layout = ({ children }) => {
  return (
    <div>
      <Drawer />
      <main>
        {children}
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
