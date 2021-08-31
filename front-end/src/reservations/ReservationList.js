import ReservationCard from './ReservationCard';
import { useRouteMatch } from 'react-router-dom';

export default function ReservationList({ reservations, loadDashboard }) {
  const { path } = useRouteMatch();

  const resList = reservations.map((reservation, reservation_id) => (
    <ReservationCard key={reservation_id} reservation={reservation} loadDashboard={() => loadDashboard} />
  ));

  return (
    <div className='card-group'>
      {resList.length ? resList : null} 
      {path.includes('search') 
        ? !resList.length && <p>No reservations found</p>
        : !resList.length && <p>No reservations this date</p>}
    </div>
  );
}