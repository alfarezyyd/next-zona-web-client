"use client";
import {BreadcrumbItem, Breadcrumbs, Button, Input, useDisclosure} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {DotsIcon} from "@/components/icons/accounts/dots-icon";
import {ExportIcon} from "@/components/icons/accounts/export-icon";
import {InfoIcon} from "@/components/icons/accounts/info-icon";
import {TrashIcon} from "@/components/icons/accounts/trash-icon";
import {SettingsIcon} from "@/components/icons/sidebar/settings-icon";
import {TableWrapper} from "@/components/table/table";
import {AddCategories} from "./add-categories";
import Loading from "@/components/Elements/Loading";
import {RenderCellCategory} from "@/components/table/render-cell-category";
import EditCategory from "@/components/categories/edit-categories";
import {toast} from "react-toastify";
import serverResponse from "assert";

const categoryColumn = [
  {name: 'ID', uid: 'id'},
  {name: 'NAME', uid: 'name'},
  {name: 'SLUG', uid: 'slug'},
  {name: 'PARENT CATEGORY', uid: 'parent_category_id'},
  {name: 'ACTION', uid: 'actions'},
];

export const Categories = () => {
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryToEdit, setCategoryToEdit] = useState(null); // State untuk kategori yang akan diedit

  const handleEditClick = (category) => {
    setCategoryToEdit(category); // Set kategori yang akan diedit
    console.log(category)
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${item.id}`,
          {
            method: "DELETE",
            headers: {
              Referer: '127.0.0.1:8000',
              Accept: 'application/json',
            },
          }
        );

        if (response.status === 400) {
          let data = await response.json();
          alert(data.message);
        }else{
          window.location.reload();
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while deleting the product.");
      }
    }

  };


  const fetchCategories = async () => {
    try {
      let responseCategory = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Referer: '127.0.0.1:8000',
          Accept: 'application/json',
        },
      });
      if (!responseCategory.ok) {
        throw new Error('Failed to fetch categories');
      }
      let responseCategoryJson = await responseCategory.json();
      setCategories(responseCategoryJson.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsContentLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {isContentLoading ? <Loading/> : (
        <div className="md:px-6 sm:px-6 xs:px-4 my-14 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
          <Breadcrumbs isDisabled size="lg">
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>Music</BreadcrumbItem>
            <BreadcrumbItem>Artist</BreadcrumbItem>
            <BreadcrumbItem>Album</BreadcrumbItem>
            <BreadcrumbItem>Song</BreadcrumbItem>
          </Breadcrumbs>

          <h3 className="text-xl font-semibold">Semua Kategori</h3>
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
              <AddCategories setIsContentLoading={setIsContentLoading} categories={categories}/>
              <Button color="primary" startContent={<ExportIcon/>}>
                Export to CSV
              </Button>
            </div>
          </div>
          <div className="max-w-[95rem] mx-auto w-full">
            {categories.length > 0 ? (
              <TableWrapper columns={categoryColumn} data={categories} renderCell={RenderCellCategory}
                            onEditClick={handleEditClick} onDeleteClick={handleDelete}/>
            ) : (
              <p>No categories available.</p>
            )}
          </div>

        </div>
      )}
      {categoryToEdit && (
        <EditCategory
          categoryToEdit={categoryToEdit}
          onClose={() => setCategoryToEdit(null)} // Tutup modal ketika selesai
          categories={categories}
        />
      )}
    </>
  );
};

