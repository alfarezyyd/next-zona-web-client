import {
  Button, DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";

export const AddTransactions = ({setIsContentLoading, products}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [transactionRequest, setTransactionRequest] = useState({
    transaction_date: "",
    description: "",
    order_payload: [{id: "", quantity: 0, price: 0}]
  });
  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setTransactionRequest({
      ...transactionRequest,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    const formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;

    setTransactionRequest({
      ...transactionRequest,
      transaction_date: formattedDate
    });
  };

  const handleProductChange = (index, field, value) => {
    const newOrderPayload = [...transactionRequest.order_payload];
    newOrderPayload[index][field] = value;

    if (field === "id") {
      const product = products.find(product => product.id === Number(value));
      newOrderPayload[index].price = product ? product.price : 0;
    }

    setTransactionRequest({
      ...transactionRequest,
      order_payload: newOrderPayload
    });
  };

  const handleAddProduct = () => {
    setTransactionRequest((prevRequest) => ({
      ...prevRequest,
      order_payload: [...prevRequest.order_payload, {id: "", quantity: 0, price: 0}]
    }));
  };

  const calculateTotalPrice = () => {
    const total = transactionRequest.order_payload.reduce((acc, item) => {
      return acc + (item.price * item.quantity || 0);
    }, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    fetchCsrf();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [transactionRequest.order_payload]);

  const fetchCsrf = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      cache: "no-store",
      headers: {
        Referer: '127.0.0.1:8000',
        Accept: 'application/json',
      },
    });
  };

  const handleSubmit = async () => {
    transactionRequest["total_price"] = totalPrice;
    transactionRequest["tax"] = totalPrice + (totalPrice * 0.11);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`, {
        method: 'POST',
        credentials: "include",
        headers: {
          Referer: '127.0.0.1:8000',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN')
        },
        body: JSON.stringify(transactionRequest),
      });

      if (response.ok) {
        // Handle successful response
        setErrors({});
        onOpenChange(false); // Close the modal
        setIsContentLoading(true); // Refresh data
      } else {
        // Handle error response
        const data = await response.json();
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Formulir Tambah Transaksi Produk
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Formulir Tambah Transaksi Produk
              </ModalHeader>
              <ModalBody>
                <DatePicker
                  label="Tanggal Transaksi"
                  variant="bordered"
                  onChange={(date) => handleDateChange(date)}
                  isInvalid={!!errors.transaction_date}
                  errorMessage={errors.transaction_date ? errors.transaction_date[0] : ""}
                  className="max-w-full"
                />
                <Textarea
                  label="Description"
                  placeholder="Enter your description"
                  onChange={handleInputChange}
                  name="description"
                  className="max-w-full"
                  isInvalid={!!errors.description}
                  errorMessage={errors.description ? errors.description[0] : ""}
                />
                {transactionRequest.order_payload.map((productQuantity, index) => (
                  <div key={index} className="flex flex-row gap-2 items-end">
                    <Select
                      label="Produk yang dibeli"
                      placeholder="Pilih produk"
                      value={productQuantity.id}
                      className="max-w-xs"
                      onChange={(e) => handleProductChange(index, 'id', e.target.value)}
                    >
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                      ))}
                    </Select>
                    <Input
                      type="number"
                      label="Kuantitas"
                      placeholder="Masukkan jumlah"
                      value={productQuantity.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                    />
                    <input type="hidden" value={productQuantity.price}/>
                  </div>
                ))}
                <Button color="primary" onClick={handleAddProduct}>
                  Tambah Produk
                </Button>
                <div className="mt-4">
                  <strong>Total Harga: </strong> {totalPrice}
                </div>
                {errors.order_payload && <p className="text-red-500">{errors.order_payload[0]}</p>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onClick={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Tambah Transaksi
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
