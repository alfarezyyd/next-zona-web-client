import {Tooltip, Chip} from "@nextui-org/react";
import React from "react";
import {DeleteIcon} from "../icons/table/delete-icon";
import {EditIcon} from "../icons/table/edit-icon";
import {EyeIcon} from "../icons/table/eye-icon";

export const RenderCellTransaction = ({item, columnKey, onEditClick, handleDelete}) => {
  const cellValue = item[columnKey];
  switch (columnKey) {
    case "id":
      return <span>{cellValue}</span>;

    case "transaction_date":
      return <span>{cellValue}</span>;

    case "total_price":
      return <span>{cellValue || "N/A"}</span>;

    case "tax":
      return <span>{cellValue || "N/A"}</span>;

    case "description":
      return <span>{cellValue || "N/A"}</span>;


    case "actions":
      return (
        <div className="flex items-center gap-4 ">

          <Tooltip content="Edit category" color="secondary">
            <button onClick={() => onEditClick(item)}>
              <EditIcon size={20} fill="#979797"/>
            </button>
          </Tooltip>
          <Tooltip content="Delete category" color="danger">
            <button onClick={() => handleDelete(item)}>
              <DeleteIcon size={20} fill="#FF0080"/>
            </button>
          </Tooltip>
        </div>
      );

    default:
      return cellValue;
  }
};
