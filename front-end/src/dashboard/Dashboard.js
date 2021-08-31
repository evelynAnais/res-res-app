import React, { useEffect, useState } from 'react';
import { listReservations, listTables } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import ReservationList from '../reservations/ReservationList';
import { useHistory } from 'react-router';
import { formatAsDate, next, previous, today } from '../utils/date-time';
import useQuery from '../utils/useQuery';
import TableList from '../tables/TableList';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  const history = useHistory();
  
  const query = useQuery().get('date');
  if (query) date = query;

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const handleDateInput = (e) => {
    date = formatAsDate(e.target.value);
    history.push(`dashboard?date=${date}`)
  };

  const handlePreviousDate = () => {
    history.push(`dashboard?date=${previous(date)}`);
  };

  const handleTodayDate = () => {
    history.push(`dashboard?date=${today()}`);
  };

  const handleNextDate = () => {
    history.push(`dashboard?date=${next(date)}`);
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className='d-md-flex mb-3'>
        <h4 className='mb-0'>Reservations for 
          <input 
            className='form-control mb-3'
            type='date' 
            id='reservation_date' 
            name='reservation_date'
            value={date}
            onChange={handleDateInput}
            required={true}
          />
        </h4>
      </div>
      <div className='mb-3 ml-0'>
        <button type='button' onClick={handlePreviousDate} className='btn btn-dark mr-3'>Previous</button>
        <button type='button' onClick={handleTodayDate} className='btn btn-dark mr-3'>Today</button>
        <button type='button' onClick={handleNextDate} className='btn btn-dark mr-3'>Next</button>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationList reservations={reservations} loadDashboard={loadDashboard} />
      <hr/>
      <TableList tables={tables} loadDashboard={loadDashboard} />
      <ErrorAlert error={tablesError} />
    </main>
  );
}

export default Dashboard;
