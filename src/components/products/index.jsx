"use client";
import {Button, Input} from "@nextui-org/react";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {DotsIcon} from "@/components/icons/accounts/dots-icon";
import {ExportIcon} from "@/components/icons/accounts/export-icon";
import {InfoIcon} from "@/components/icons/accounts/info-icon";
import {TrashIcon} from "@/components/icons/accounts/trash-icon";
import {HouseIcon} from "@/components/icons/breadcrumb/house-icon";
import {UsersIcon} from "@/components/icons/breadcrumb/users-icon";
import {SettingsIcon} from "@/components/icons/sidebar/settings-icon";
import {TableWrapper} from "@/components/table/table";
import {AddProduct} from "./add-product";
import Loading from "@/components/Elements/Loading";
import {RenderCellProduct} from "@/components/table/render-cell-product";
import {EditProduct} from "@/components/products/edit-product";
import {Bounce, toast, ToastContainer} from "react-toastify";
import serverResponse from "assert";

const productColumn = [
  {name: "ID", uid: "id"},
  {name: "NAME", uid: "name"},
  {name: "PRICE", uid: "price"},
  {name: "STOCK", uid: "stock"},
  {name: "SKU", uid: "sku"},
  {name: "DIPRODUKSI OLEH", uid: "produced_by"},
  {name: "STATUS", uid: "status"},
  {name: "GAMBAR", uid: "resources"},
  {name: "ACTION", uid: "actions"},
];

export const Products = () => {
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchCategories = async () => {
    try {
      let responseCategory = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Referer: "127.0.0.1:8000",
            Accept: "application/json",
          },
        }
      );
      if (!responseCategory.ok) {
        throw new Error("Failed to fetch categories");
      }
      let responseCategoryJson = await responseCategory.json();
      setCategories(responseCategoryJson.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      let responseProduct = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Referer: "127.0.0.1:8000",
            Accept: "application/json",
          },
        }
      );
      if (!responseProduct.ok) {
        throw new Error("Failed to fetch products");
      }
      let responseProductJson = await responseProduct.json();
      setProducts(responseProductJson.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  const handleDeleteClick = async (item) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${item.slug}`,
          {
            method: "DELETE",
            headers: {
              Referer: '127.0.0.1:8000',
              Accept: 'application/json',
            },
          }
        );

        if (serverResponse.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while deleting the product.");
      }
    }
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
  };

  const handleSave = () => {
    setProductToEdit(null);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <>
      {isContentLoading ? (
        <Loading/>
      ) : (
        <div className="md:px-6 sm:px-6 xs:px-4 my-14 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
          <ul className="flex">
            <li className="flex gap-2">
              <HouseIcon/>
              <Link href={"/"}>
                <span>Home</span>
              </Link>
              <span> / </span>{" "}
            </li>

            <li className="flex gap-2">
              <UsersIcon/>
              <span>Users</span>
              <span> / </span>{" "}
            </li>
            <li className="flex gap-2">
              <span>List</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold">All Accounts</h3>
          <div className="flex justify-between flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
              <Input
                classNames={{
                  input: "w-full",
                  mainWrapper: "w-full",
                }}
                placeholder="Search users"
              />
              <SettingsIcon/>
              <TrashIcon/>
              <InfoIcon/>
              <DotsIcon/>
            </div>
            <div className="flex flex-row gap-3.5 flex-wrap">
              <AddProduct
                categories={categories}
              />
              <Button color="primary" startContent={<ExportIcon/>}>
                Export to CSV
              </Button>
            </div>
          </div>
          <div className="max-w-[95rem] mx-auto w-full">
            {products.length > 0 ? (
              <TableWrapper
                columns={productColumn}
                data={products}
                renderCell={({item, columnKey}) => (
                  <RenderCellProduct
                    item={item}
                    columnKey={columnKey}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                  />
                )}
              />
            ) : (
              <p>No products available.</p>
            )}
          </div>
        </div>
      )}
      {productToEdit && (
        <EditProduct
          productToEdit={productToEdit}
          categories={categories}
          onSave={handleSave}
          onClose={() => setProductToEdit(null)}
        />
      )}
    </>
  );
};
