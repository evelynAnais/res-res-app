import { useRouteMatch } from "react-router-dom";

export default function ReservationCard({ reservation }) {
  const { path } = useRouteMatch();
  
  return (
    <>
      <div className='card border-secondary text-white bg-dark mt-3' style={{'width': '18rem'}}>
        <div className='card-header bg-transparent'>
          {reservation?.first_name} {reservation?.last_name}
        </div>
        <ul className='list-group list-group-flush'>
          <li className='list-group-item'>Mobile Number: {reservation?.mobile_number}</li>
          <li className='list-group-item'>Reservation Date: {reservation?.reservation_date}</li>
          <li className='list-group-item'>Reservation Time: {reservation?.reservation_time}</li>
          <li className='list-group-item'>People: {reservation?.people}</li>
          <li className='list-group-item' data-reservation-id-status={reservation.reservation_id}>Status: {reservation?.status} </li>
          <div className='card-footer bg-transparent border-dark'>
            {path.includes('seat') 
              ? null 
              : reservation?.status === 'seated' 
              ? null 
              : <a href={`/reservations/${reservation?.reservation_id}/seat`} className='btn btn-secondary btn-block'>Seat</a>}
          </div>
        </ul>
      </div>
    </>
  )
}