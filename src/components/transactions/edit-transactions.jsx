import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {parseDate} from "@internationalized/date";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure
} from '@nextui-org/react';

const EditTransactions = ({transactionToEdit, setIsContentLoading, products, onClose}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [transactionRequest, setTransactionRequest] = useState({
    transaction_date: '',
    description: '',
    order_payload: [{id: '', quantity: 0, price: 0}]
  });
  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (transactionToEdit) {
      setTransactionRequest({
        id: transactionToEdit.id,
        transaction_date: parseDate(transactionToEdit.transaction_date),
        total_price: transactionToEdit.total_price,
        tax: transactionToEdit.tax,
        description: transactionToEdit.description,
        order_payload: transactionToEdit.products.map(product => ({
          id: product.id,
          name: product.name, // Sesuaikan dengan nama properti yang digunakan oleh ProductResource
          product_id: product.id, // Mengatur product_id berdasarkan produk yang dipilih sebelumnya=
          price: product.price,
        }))
      });
    }
    onOpen()
  }, [transactionToEdit]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setTransactionRequest({
      ...transactionRequest,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setTransactionRequest({
      ...transactionRequest,
      transaction_date: date
    });
  };

  const handleProductChange = (index, field, value) => {
    const newOrderPayload = [...transactionRequest.order_payload];
    newOrderPayload[index][field] = value;
    setTransactionRequest({
      ...transactionRequest,
      order_payload: newOrderPayload
    });
  };

  const handleAddProduct = () => {
    setTransactionRequest((prevRequest) => ({
      ...prevRequest,
      order_payload: [...prevRequest.order_payload, {product_id: '', quantity: 0}]
    }));
  };

  const calculateTotalPrice = () => {
    const total = transactionRequest.order_payload.reduce((acc, item) => {
      const product = products.find(product => product.id === Number(item.product_id));
      const productPrice = product ? product.price : 0;
      return acc + (productPrice * item.quantity || 0);
    }, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [transactionRequest.order_payload]);

  const handleSubmit = async () => {
    let date =  transactionRequest['transaction_date']
    let formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
    let transactionRequestTrue = {...transactionRequest};
    transactionRequestTrue['transaction_date'] = formattedDate;
    console.log(transactionRequestTrue)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/edit/${transactionToEdit.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Referer: '127.0.0.1:8000',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN')
        },
        body: JSON.stringify(transactionRequestTrue),
      });

      if (response.ok) {
        setErrors({});
        onOpenChange(false);
        setIsContentLoading(true);
      } else {
        const data = await response.json();
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }finally {
      setIsContentLoading(false)
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Transaction
              </ModalHeader>
              <ModalBody>
                <DatePicker
                  label="Transaction Date"
                  variant="bordered"
                  onChange={(date) => handleDateChange(date)}
                  value={transactionRequest.transaction_date}
                  isInvalid={!!errors.transaction_date}
                  errorMessage={errors.transaction_date ? errors.transaction_date[0] : ''}
                  className="max-w-full"
                />
                <Textarea
                  label="Description"
                  placeholder="Enter your description"
                  onChange={handleInputChange}
                  name="description"
                  value={transactionRequest.description}
                  className="max-w-full"
                  isInvalid={!!errors.description}
                  errorMessage={errors.description ? errors.description[0] : ''}
                />
                {transactionRequest.order_payload.map((productQuantity, index) => (
                  <div key={index} className="flex flex-row gap-2 items-end">
                    <Select
                      label="Product"
                      placeholder="Select product"
                      value={productQuantity.product_id}
                      className="max-w-xs"
                      onChange={(e) => handleProductChange(index, 'product_id', e.target.value)}
                    >
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                      ))}
                    </Select>
                    <Input
                      type="number"
                      label="Quantity"
                      placeholder="Enter quantity"
                      value={productQuantity.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                    />
                    <input type="hidden" value={productQuantity.price}/>

                  </div>
                ))}
                <Button color="primary" onClick={handleAddProduct}>
                  Add Product
                </Button>
                <div className="mt-4">
                  <strong>Total Price: </strong> {totalPrice}
                </div>
                {errors.order_payload && <p className="text-red-500">{errors.order_payload[0]}</p>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onClick={onClose}>
                  Close
                </Button>
                <Button color="primary" onClick={handleSubmit}>
                  Update Transaction
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditTransactions;
