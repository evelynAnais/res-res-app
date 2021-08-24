import ReservationCard from './ReservationCard';

export default function ReservationList({ reservations }) {
  const resList = reservations.map((reservation, reservation_id) => (
    <ReservationCard key={reservation_id} reservation={reservation} />
  ));
  return(
    <div className='card-group'>
      {resList.length ? resList : null} 
      {!resList.length && <p>No reservations this date</p>}
    </div>
  )
}