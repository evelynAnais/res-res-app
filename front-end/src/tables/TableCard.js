export default function TableCard({ table }) {
  return(
    <>
      <div className="card border-dark mb-3" style={{'width': '18rem'}}>
        <div className="card-header bg-transparent">Table Name: {table?.table_name}</div>
        <div className="card-body text-dark">
          <h5 className="card-title" data-table-id-status={`${table.table_id}`}>{table.reservation_id ? 'Occupied' : 'Free'}</h5>
          <p className="card-text" >Capacity: {table.capacity}</p>
        </div>
      </div>
    </>
  )
}