export default function TableCard({ table }) {
  
  return(
    <>
      <div className='card border-secondary mb-3' style={{'width': '18rem'}}>
        <div className='card-header bg-transparent'>Table Name: {table?.table_name}</div>
        <div className='card-body text-dark pb-0'>
          <h5 className='card-title' data-table-id-status={`${table.table_id}`}>{table.reservation_id ? 'Occupied' : 'Free'}</h5>
          <p className='card-text' >Capacity: {table.capacity}</p>
          <div className='card-footer bg-transparent border-dark'>
            <button type='button' data-table-id-finish={table.table_id} className='btn btn-secondary btn-block'>Finish</button>
          </div>
        </div>
      </div>
    </>
  )
}