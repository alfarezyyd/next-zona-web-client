import {Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from "@nextui-org/react";

export const TableWrapper = ({columns, data, renderCell, onEditClick, onDeleteClick}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.uid}>
                  {renderCell({item, columnKey: column.uid, onEditClick: onEditClick, handleDelete: onDeleteClick})}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};