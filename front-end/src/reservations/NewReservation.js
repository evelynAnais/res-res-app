import ReservationForm from './ReservationForm'
import { useRouteMatch } from "react-router-dom";

export default function NewReservation() {
  const { path } = useRouteMatch();

  return (
    <div>
      {path.includes('edit') 
        ? <h4 className='text-center pt-5'>Edit Reservation</h4>
        : <h4 className='text-center pt-5'>Make a New Reservation</h4>}
        <ReservationForm />
    </div>
  );
}