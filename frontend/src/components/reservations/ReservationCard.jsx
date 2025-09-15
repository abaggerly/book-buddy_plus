const ReservationCard = ({ reservation }) => {
  return (
    <li className='reservations-items'>
      <p>{reservation.title}</p>
      <p>{reservation.author}</p>
      <button>Return Book</button>
    </li>
  );
};

export default ReservationCard;
