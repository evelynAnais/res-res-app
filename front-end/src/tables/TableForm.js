import { useState } from 'react';
import { useHistory } from 'react-router';
import ErrorAlert from "../layout/ErrorAlert";

export default function TableForm() {
  const [newTable, setNewTable] = useState({
    table_name: '',
    capacity: '1',
  })

  const [error, setError] = useState(null);

  const history = useHistory()
  
  // function handleChange({ target }) {
  //   let newValue = target.value;
  //   if (target.name === 'people') {
  //     newValue = Number(target.value);
  //   }
  //   setNewReservation((previousTable) => ({
  //     ...previousTable,
  //     [target.name]: newValue,
  //   }));
  // }

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   createReservation(newTable)
  //     .then(() => history.push(`/dashboard?date=${formatAsDate(newReservation.reservation_date)}`))
  //     .catch(setError);
  // }

  const handleCancel = () => {
    history.push('/')
  }

  return(
    <>
      <div className='container'>
      <form className='row d-flex'>
        <label htmlFor='table_name' className='form-label'>
          Table Name:
          <input 
            className='form-control mb-3'
            type='text' 
            id='table_name' 
            name='table_name'
            //value={newTable.table_name}
            //onChange={handleChange}
            required={true}
          />
        </label>
        <label htmlFor='capacity'>
          Capacity:
          <input 
            className='form-control mb-3'
            type='number' 
            id='capacity' 
            name='capacity'
            min='1'
            placeholder='1'
            //value={newTable.capacity}
            //onChange={handleChange}
            required={true}
          />
        </label>
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12'>
            <div  className='text-center'>
              <ErrorAlert error={error} />
              <button type='submit' className='btn btn-dark mr-3 ml-3'>Submit</button>
              <button type='button' onClick={handleCancel} className='btn btn-dark mr-3 ml-3'>Cancel</button>
              {/* <button type='submit' onClick={handleSubmit} className='btn btn-dark mr-3 ml-3'>Submit</button> */}
            </div>
          </div>
        </div>
      </div>
    </form>
    </div>
    </>
  )
}