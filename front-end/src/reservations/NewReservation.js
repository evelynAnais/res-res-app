import React, { useEffect, useState } from 'react';
import ReservationForm from './ReservationForm';
import { useRouteMatch } from "react-router-dom";
import { readReservation } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function NewReservation() {
  const [reservation, setReservation] = useState({});
  const [resError, setResError] = useState(null);
  const { path, params } = useRouteMatch();

  useEffect(() => {
    function loadForm() {
      const abortController = new AbortController();
      readReservation(params.reservation_id, abortController.signal)  
        .then(setReservation)
        .catch(setResError)
      return () => abortController.abort();
    }

    if (params.reservation_id) loadForm();
  }, [params.reservation_id]);

  return (
    <div>
      {path.includes('edit') 
        ? <h4 className='text-center pt-5'>Edit Reservation</h4>
        : <h4 className='text-center pt-5'>Make a New Reservation</h4>}
        <ReservationForm reservation={reservation} />
        <ErrorAlert error={resError} />
    </div>
  );
}