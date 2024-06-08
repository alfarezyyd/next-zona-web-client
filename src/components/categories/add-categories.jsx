import {
  Button,
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

export const AddCategories = ({setIsContentLoading, categories}) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [saveCategoryRequest, setSaveProductRequest] = useState({
    name: "",
    category_id: ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setSaveProductRequest({
      ...saveCategoryRequest,
      [name]: value,
    });
  };

  const fetchCsrf = (async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      cache: "no-store",
      headers: {
        Referer: '127.0.0.1:8000',
        Accept: 'application/json',
      },
    });
  })

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
        method: 'POST',
        credentials: "include",
        headers: {
          Referer: '127.0.0.1:8000',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN')
        },
        body: JSON.stringify(saveCategoryRequest),
      });

      if (response.ok) {
        // Handle successful response
        setErrors({});
        onOpenChange(false); // Close the modal
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

  useEffect(() => {
    fetchCsrf()
  }, [])

  return (

    <div>
      <Button onPress={onOpen} color="primary">
        Formulir Tambah Kategori Produk
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Formulir Tambah Kategori Produk
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Nama Category"
                  variant="bordered"
                  name="name"
                  value={saveCategoryRequest.name}
                  onChange={handleInputChange}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name ? errors.name[0] : ""}
                />

                <Select
                  label="Kategori Produk"
                  placeholder="Pilih salah satu kategori"
                  className="max-w-full"
                  onChange={handleInputChange}
                  name="category_id"
                  isInvalid={!!errors.category_id}
                >
                  {/* Ganti items dengan data kategori dari state atau props */}
                  {categories.map((category) => {
                    return (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    )
                  })}
                </Select>
                {errors.category_id && <p className="text-red-500">{errors.category_id[0]}</p>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onClick={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Tambah Kategori
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
};
