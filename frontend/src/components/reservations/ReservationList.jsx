import ReservationCard from './ReservationCard';

const ReservationList = ({ reservations }) => {
  return (
    <ul className='reservations-list'>
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.id} reservation={reservation} />
      ))}
    </ul>
  );
};

export default ReservationList;
