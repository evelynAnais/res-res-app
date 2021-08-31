import { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import ReservationList from "./ReservationList";

export default function Search() {
  const [search, setSearch] = useState({
    mobile_number: ''
  });
  const [haveSearched, setHaveSearched] = useState(false)
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  function handleChange({ target }) {
    setSearch((previousSearch) => ({
      ...previousSearch,
      [target.name]: target.value
    }))
  }  

  const handleFind = (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    setReservationsError(null);
    
    listReservations(search, abortController.signal)
      .then(setReservations)
      .then(() => setHaveSearched(true))
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <>
      <div>
        <h4 className='text-center pt-5'>Search</h4>
      </div>
      <div className='container'>
        <form className='row d-flex' onSubmit={handleFind}>
          <label htmlFor='mobile_number' className='form-label'>
            <div className='input-group mb-3'>
              <input 
                className='form-control' 
                aria-label='mobile_number' 
                aria-describedby='button-addon2'
                type='text'
                id='mobile_number' 
                name='mobile_number'
                placeholder="Enter a customer's phone number" 
                value={search.mobile_number}
                onChange={handleChange}
                required={true}
              />
              <button 
                className='btn btn-dark' 
                type='submit' 
                id='button-addon2'>
                  Find
              </button>
            </div>
          </label>
        </form>
      </div>
      {haveSearched && <ReservationList reservations={reservations} />}
      <ErrorAlert error={reservationsError} />
    </>
  )
}