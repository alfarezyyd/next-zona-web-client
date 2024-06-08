// edit-category.js
import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import Cookies from 'js-cookie';

const EditCategory = ({ categoryToEdit, onSave, onClose, categories }) => {
  const [editCategoryRequest, setEditCategoryRequest] = useState({
    name: '',
    category_id: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (categoryToEdit) {
      setEditCategoryRequest({
        name: categoryToEdit.name,
        category_id: categoryToEdit.category_id,
      });
    }
  }, [categoryToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditCategoryRequest({
      ...editCategoryRequest,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    console.log(editCategoryRequest);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/edit/${categoryToEdit.id}`, {
        method: 'POST',
        headers: {
          Referer: '127.0.0.1:8000',
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editCategoryRequest),
      });

      if (response.ok) {
        setErrors({});
        onClose();
        window.location.reload()
      } else {
        const data = await response.json();
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Modal isOpen={!!categoryToEdit} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Formulir Edit Kategori Produk
          </ModalHeader>
          <ModalBody>
            <Input
              label="Nama Category"
              variant="bordered"
              name="name"
              value={editCategoryRequest.name}
              onChange={handleInputChange}
              isInvalid={!!errors.name}
              errorMessage={errors.name ? errors.name[0] : ''}
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
              Simpan Perubahan
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default EditCategory;
