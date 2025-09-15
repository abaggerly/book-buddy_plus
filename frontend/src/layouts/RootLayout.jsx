import { Outlet } from 'react-router';

import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
        <ToastContainer />
      </main>
    </>
  );
};

export default RootLayout;
