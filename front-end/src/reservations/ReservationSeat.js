import React, { useEffect, useState } from 'react';
import { listTables, readReservation, updateTable } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ReservationCard from './ReservationCard';

export default function ReservationSeat() {
  const [tables, setTables] = useState([]);
  const [resId, setResId] = useState([]);
  const [tableSelect, setTableSelect] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [resError, setResError] = useState(null);
  const { params } = useRouteMatch();
  const history = useHistory();

  useEffect(loadTables, [params.reservation_id]);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    readReservation(params.reservation_id, abortController.signal)  
      .then(setResId)
      .catch(setResError);
    return () => abortController.abort();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTable = {
      table_id: tableSelect,
      reservation_id: resId.reservation_id
    }
    updateTable(updatedTable)
      .then(() => history.push(`/dashboard?date=${resId.reservation_date}`))
      .catch(setFormError);
  }

  function handleChange({ target }) {
    setTableSelect(target.value);
  }

  const handleCancel = () => {
    history.goBack();
  }

  const tableOptions = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
  ));

  return (
    <div className='container'>
      <h4 className='text-center pt-5'>Seat Table</h4>
      <div className='row'>
        <div className='col'>
          <ReservationCard reservation={resId} />
          <ErrorAlert error={resError}/>
          <ErrorAlert error={tablesError}/>
        </div>
        <div className='col'>
          <form className='mt-5'>
            <select name="table_id" className="form-select" onChange={handleChange} aria-label="Default select example">
              <option value="">Select to Seat Reservation</option>
              { tableOptions }
            </select>
            <div className='container mt-3'>
              <div className='row'>
                <div className='col-xs-12'>
                  <div  className='text-center'>
                    <ErrorAlert error={formError} />
                    <button type='submit' onClick={handleSubmit} className='btn btn-dark mr-3 ml-3 mb-3'>Submit</button>
                    <button type='button' onClick={handleCancel} className='btn btn-dark mr-3 ml-3 mb-3'>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 