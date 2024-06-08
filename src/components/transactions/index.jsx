"use client";
import {BreadcrumbItem, Breadcrumbs, Button, Input, useDisclosure} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {DotsIcon} from "@/components/icons/accounts/dots-icon";
import {ExportIcon} from "@/components/icons/accounts/export-icon";
import {InfoIcon} from "@/components/icons/accounts/info-icon";
import {TrashIcon} from "@/components/icons/accounts/trash-icon";
import {SettingsIcon} from "@/components/icons/sidebar/settings-icon";
import {TableWrapper} from "@/components/table/table";
import {AddTransactions} from "./add-transactions";
import Loading from "@/components/Elements/Loading";
import {RenderCellTransaction} from "@/components/table/render-cell-transactions";
import {toast} from "react-toastify";
import serverResponse from "assert";
import EditTransactions from "@/components/transactions/edit-transactions";

const transactionsColumn = [
  {name: 'ID', uid: 'id'},
  {name: 'TRANSACTION DATE', uid: 'transaction_date'},
  {name: 'TOTAL PRICE', uid: 'total_price'},
  {name: 'TAX', uid: 'tax'},
  {name: 'DESCRIPTION', uid: 'description'},
  {name: 'ACTION', uid: 'actions'},
];

export const Transactions = () => {
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionsToEdit, setTransactionToEdit] = useState(null); // State untuk kategori yang akan diedit

  const handleEditClick = (transactions) => {
    setTransactionToEdit(transactions); // Set kategori yang akan diedit
    console.log(transactions)
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/${item.id}`,
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
        } else {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while deleting the product.");
      }
    }

  };


  const fetchProducts = async () => {
    try {
      let responseTransaction = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Referer: '127.0.0.1:8000',
          Accept: 'application/json',
        },
      });
      if (!responseTransaction.ok) {
        throw new Error('Failed to fetch products');
      }
      let responseTransactionJson = await responseTransaction.json();
      console.log(responseTransactionJson)
      setProducts(responseTransactionJson.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsContentLoading(false);
    }
  };
  const fetchTransactions = async () => {
    try {
      let responseTransaction = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Referer: '127.0.0.1:8000',
          Accept: 'application/json',
        },
      });
      if (!responseTransaction.ok) {
        throw new Error('Failed to fetch products');
      }
      let responseTransactionJson = await responseTransaction.json();
      console.log(responseTransactionJson)
      setTransactions(responseTransactionJson.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsContentLoading(false);
      console.log(transactions)
    }
  };


  useEffect(() => {
    fetchProducts();
    fetchTransactions()
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

          <h3 className="text-xl font-semibold">Semua Transaksi</h3>
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
              <AddTransactions setIsContentLoading={setIsContentLoading} products={products}/>
              <Button color="primary" startContent={<ExportIcon/>}>
                Export to CSV
              </Button>
            </div>
          </div>
          <div className="max-w-[95rem] mx-auto w-full">
            {products.length > 0 ? (
              <TableWrapper columns={transactionsColumn} data={transactions} renderCell={RenderCellTransaction}
                            onEditClick={handleEditClick} onDeleteClick={handleDelete}/>
            ) : (
              <p>No products available.</p>
            )}
          </div>

        </div>
      )}
      {transactionsToEdit && (
        <EditTransactions
          transactionToEdit={transactionsToEdit}
          products={products}
          setIsContentLoading={setIsContentLoading}
          onClose={() => setTransactions(null)}
        />
      )}
    </>
  );
};

