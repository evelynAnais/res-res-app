import { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { deleteFinish } from "../utils/api";

export default function TableCard({ table, loadDashboard}) {
  const [finishError, setFinishError] = useState(null);

  const handleFinish = (e) => {
    e.preventDefault();
    if (window.confirm('Is this table ready to seat new guests? This cannot be undone.')) {
      const abortController = new AbortController ();
      setFinishError(null);
      deleteFinish(e.target.value, abortController.signal)
        .then((res) => console.log(res))
        .then(loadDashboard())
        .catch(setFinishError);
      return () => abortController.abort()
    }
  };

  return(
    <>
      <div className='card border-secondary mb-3' style={{'width': '18rem'}}>
        <div className='card-header bg-transparent'>Table Name: {table?.table_name}</div>
        <div className='card-body text-dark pb-0'>
          <h5 className='card-title' data-table-id-status={`${table?.table_id}`}>{table?.reservation_id ? 'Occupied' : 'Free'}</h5>
          <p className='card-text' >Capacity: {table.capacity}</p>
          <div className='card-footer bg-transparent border-dark'>
            {table?.reservation_id === null 
            ? null 
            : <button 
              type='button' 
              value={table?.table_id} 
              onClick={handleFinish} 
              data-table-id-finish={table?.table_id} 
              className='btn btn-secondary btn-block'>
                Finish
            </button>}
          </div>
          <ErrorAlert error={finishError} />
        </div>
      </div>
    </>
  )
}