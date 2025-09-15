import { NavLink } from 'react-router';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useAuth();

  return (
    <>
      <div className='nav-bar'>
        <NavLink to='/'>📚 Books</NavLink>
        <div className='nav-items'>
          {token ? (
            <>
              <NavLink to='/account'>Account</NavLink>
              <NavLink onClick={logout}>Log Out</NavLink>
            </>
          ) : (
            <>
              <NavLink to='/register'>Register</NavLink>
              <NavLink to='/login'>Login</NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
