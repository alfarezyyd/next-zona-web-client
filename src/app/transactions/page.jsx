import React from 'react';
import {AdminLayout} from "@/components/AdminLayout";
import {Transactions} from "@/components/transactions";

const accounts = () => {
  return (
    <AdminLayout>
      <Transactions/>
    </AdminLayout>
  );
};

export default accounts;
