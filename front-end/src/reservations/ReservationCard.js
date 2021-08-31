import { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { updateReservationStatus } from "../utils/api";

export default function ReservationCard({ reservation, loadDashboard }) {
  const [cancelError, setCancelError] = useState(null);
  const { path } = useRouteMatch();
  
  const handleCancel = (e) => {
    e.preventDefault();
    if (window.confirm('Do you want to cancel this reservation? This cannot be undone.')) {
      const abortController = new AbortController ();
      setCancelError(null);
      const update = {
        reservation_id: e.target.value,
        status: 'cancelled'
      }
      updateReservationStatus(update, abortController.signal)
        .then((res) => console.log(res))
        .then(loadDashboard())
        .catch(setCancelError);
      return () => abortController.abort()
    }
  };
  
  return (
    <>
      {reservation?.status !== 'cancelled' && <div className='card border-secondary text-white bg-dark mt-3' style={{'width': '18rem'}}>
        <div className='card-header bg-transparent'>
          {reservation?.first_name} {reservation?.last_name}
        </div>
        <ul className='list-group list-group-flush'>
          <li className='list-group-item'>Mobile Number: {reservation?.mobile_number}</li>
          <li className='list-group-item'>Reservation Date: {reservation?.reservation_date}</li>
          <li className='list-group-item'>Reservation Time: {reservation?.reservation_time}</li>
          <li className='list-group-item'>People: {reservation?.people}</li>
          <li className='list-group-item' data-reservation-id-status={reservation?.reservation_id}>Status: {reservation?.status} </li>
          <div className='card-footer bg-transparent border-dark'>
            {path.includes('seat') 
              ? null 
              : reservation?.status === 'seated' 
              ? null 
              : <>
                  <a href={`/reservations/${reservation?.reservation_id}/seat`} className='btn btn-secondary btn-block'>Seat</a>
                  <a href={`/reservations/${reservation?.reservation_id}/edit`} className='btn btn-secondary btn-block'>Edit</a>
                  <button 
                    type='button' 
                    onClick={handleCancel} 
                    value={reservation?.reservation_id} 
                    data-reservation-id-cancel={reservation?.reservation_id}
                    className='btn btn-secondary btn-block'>
                      Cancel
                  </button>
                  <ErrorAlert error={cancelError} />
                </>}
          </div>
        </ul>
      </div>}
    </>
  )
}