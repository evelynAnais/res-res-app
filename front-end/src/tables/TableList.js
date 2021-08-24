import TableCard from "./TableCard";

export default function TableList({ tables }) {
  const tabList = tables.map((table, table_id) => (
    <TableCard  key={table_id} table={table} />
  ));
  return(
    <>
      {tabList.length ? tabList : null}
    </>
  )
}