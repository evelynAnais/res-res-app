import TableCard from'./TableCard';

export default function TableList({ tables, loadDashboard }) {
  const tabList = tables.map((table, table_id) => (
    <TableCard  key={table_id} table={table} loadDashboard={() => loadDashboard} />
  ));

  return(
    <div className='card-columns'>
      {tabList.length ? tabList : null}
    </div>
  )
}