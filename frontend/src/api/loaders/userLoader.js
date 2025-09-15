import { jwtDecode } from 'jwt-decode';

const fetchReservationsByUserId = async (userId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/users/${userId}/reservations`
    );
    const data = await res.json();

    return data;
  } catch (err) {
    console.error(err);
  }
};

const userLoader = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const { id } = jwtDecode(token);
    const res = await fetch(`http://localhost:3000/users/${id}`);
    const data = await res.json();

    const reservations = await fetchReservationsByUserId(id);
    const userData = { ...data, reservations };

    console.log(userData);

    return userData;
  } catch (err) {
    console.error(err);
  }
};

export default userLoader;
