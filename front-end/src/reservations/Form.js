import { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import { formatAsDate, today } from "../utils/date-time";

export default function Form() {
  const [newReservation, setNewReservation] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: today(),
    reservation_time: '10:30',
    people: 0,
    status: 'booked',
  })
  
  const [error, setError] = useState(null);

  const history = useHistory()
  
  function handleChange({ target }) {
    let newValue = target.value;
    if (target.name === 'people') {
      newValue = Number(target.value);
    }
    setNewReservation((previousReservation) => ({
      ...previousReservation,
      [target.name]: newValue,
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createReservation(newReservation)
      .then(() => history.push(`/dashboard?date=${formatAsDate(newReservation.reservation_date)}`))
      .catch(setError);
  }

  const handleCancel = () => {
    history.push('/')
  }

  return (
    <div className='container'>
      <form className='row d-flex'>
        <label htmlFor='first_name' className='form-label'>
          First Name:
          <input 
            className='form-control mb-3'
            type='text' 
            id='first_name' 
            name='first_name'
            value={newReservation.first_name}
            onChange={handleChange}
            required={true}
          />
        </label>
        <label htmlFor='last_name'>
          Last Name:
          <input 
            className='form-control mb-3'
            type='text' 
            id='last_name' 
            name='last_name'
            value={newReservation.last_name}
            onChange={handleChange}
            required={true}
          />
        </label>
      <label htmlFor='mobile_number'>
        Mobile Number:
        <input 
          className='form-control mb-3'
          type='tel'
          pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
          placeholder='123-123-1233'
          id='mobile_number' 
          name='mobile_number'
          value={newReservation.mobile_number}
          onChange={handleChange}
          required={true}
        />
      </label>
      <label htmlFor='reservation_date'>
        Date of reservation:
        <input 
          className='form-control mb-3'
          type='date' 
          id='reservation_date' 
          name='reservation_date'
          value={newReservation.reservation_date}
          onChange={handleChange}
          required={true}
        />
      </label>
      <label htmlFor='reservation_time'>
        Time of reservation:
        <input 
          className='form-control mb-3'
          type='time' 
          id='reservation_time' 
          name='reservation_time'
          value={newReservation.reservation_time}
          onChange={handleChange}
          required={true}
        />
      </label>
      <label htmlFor='people'>
        Number of people:
        <input 
          className='form-control mb-3'
          type='number' 
          id='people' 
          name='people'
          min='1'
          value={newReservation.people}
          onChange={handleChange}
          required={true}
        />
      </label>
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div  className="text-center">
              <ErrorAlert error={error} />
              <button type="submit" onClick={handleSubmit} className='btn btn-dark mr-3 ml-3'>Submit</button>
              <button type="button" onClick={handleCancel} className='btn btn-dark mr-3 ml-3'>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </form>
    </div>
  )
}