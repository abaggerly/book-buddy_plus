import { useLoaderData } from 'react-router';
import ReservationList from '../components/reservations/ReservationList';

const AccountPage = () => {
  const userData = useLoaderData() || {};

  console.log(userData);

  return (
    <>
      <div className='user-profile-container'>
        <h1>Hello, {userData.firstName}</h1>
        <p>Registered Email: {userData.email}</p>
        <div className='reservations-container'>
          <h2>Active Reservations</h2>
          <ReservationList reservations={userData.reservations} />
        </div>
      </div>
    </>
  );
};

export default AccountPage;
