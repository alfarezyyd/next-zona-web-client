import {Tooltip, Chip, Image} from "@nextui-org/react";
import React from "react";
import {DeleteIcon} from "../icons/table/delete-icon";
import {EditIcon} from "../icons/table/edit-icon";
import {EyeIcon} from "../icons/table/eye-icon";

export const RenderCellProduct = ({item, columnKey, onEditClick, onDeleteClick}) => {
  const cellValue = item[columnKey];

  switch (columnKey) {
    case "id":
      return <span>{cellValue}</span>;

    case "name":
      return <span>{cellValue}</span>;

    case "price":
      return <span>{`Rp ${cellValue}`}</span>;

    case "stock":
      return <span>{cellValue}</span>;

    case "sku":
      return <span>{cellValue}</span>;

    case "produced_by":
      return <span>{cellValue}</span>;

    case "resources": {
      return cellValue[0] !== undefined ? (
         <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/stores/${cellValue[0].image_path}`}
          alt="product"
          width={50}
          height={50}
        />
      ) : (
        <p>Gambar tidak ada</p>
      )
    }
    case "status":
      return (
        <Chip
          size="sm"
          variant="flat"
          color={cellValue === "ACTIVE" ? "success" : "warning"}
        >
          <span className="capitalize text-xs">{cellValue}</span>
        </Chip>
      );

    case "actions":
      return (
        <div className="flex items-center gap-4 ">

          <Tooltip content="Edit item" color="secondary">
            <button onClick={() => onEditClick(item)}>
              <EditIcon size={20} fill="#979797"/>
            </button>
          </Tooltip>
          <Tooltip content="Delete item" color="danger">
            <button onClick={() => onDeleteClick(item)}>
              <DeleteIcon size={20} fill="#FF0080"/>
            </button>
          </Tooltip>
        </div>
      );

    default:
      return cellValue;
  }
};
