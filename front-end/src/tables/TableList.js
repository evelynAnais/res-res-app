import TableCard from'./TableCard';

export default function TableList({ tables, loadDashboard, date }) {
  const tabList = tables.map((table, table_id) => (
    <TableCard  key={table_id} table={table} loadDashboard={() => loadDashboard} date={date} />
  ));

  return (
    <div className='card-columns'>
      {tabList.length ? tabList : null}
    </div>
  );
}