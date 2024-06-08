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
} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {FileUploader} from "react-drag-drop-files";
import {Bounce, toast, ToastContainer} from "react-toastify";

export const EditProduct = ({productToEdit, categories, onSave, onClose}) => {
  const [saveProductRequest, setSaveProductRequest] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    produced_by: "",
    status: "",
    category_id: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productToEdit) {
      setSaveProductRequest({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        stock: productToEdit.stock,
        sku: productToEdit.sku,
        produced_by: productToEdit.produced_by,
        status: productToEdit.status,
        category_id: productToEdit.category.category_id,
      });
    }
  }, [productToEdit]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setSaveProductRequest({
      ...saveProductRequest,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setSaveProductRequest({
      ...saveProductRequest,
      [name]: value.target.value,
    });
  };

  const handleFileChange = (files) => {
    setImageFiles(files);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const key in saveProductRequest) {
      formData.append(key, saveProductRequest[key]);
    }
    Array.from(imageFiles).forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    // Log the FormData keys and values
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const serverResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/edit/${productToEdit.slug}`,
        {
          method: "POST",
          cache: "no-store",
          headers: {
            Referer: '127.0.0.1:8000',
            Accept: 'application/json',
          },
          body: formData,
        }
      );

      if (serverResponse.ok) {
        setErrors({});
        onClose();
        onSave();
        toast.success('🦄 Update data berhasil!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        const data = await serverResponse.json();
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (<>
      <Modal isOpen={!!productToEdit} onOpenChange={onClose} placement="top-center">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Formulir Edit Produk
            </ModalHeader>
            <ModalBody>
              <Input
                label="Nama Produk"
                variant="bordered"
                name="name"
                value={saveProductRequest.name}
                onChange={handleInputChange}
                isInvalid={!!errors.name}
                errorMessage={errors.name ? errors.name[0] : ""}
              />
              <Textarea
                isRequired
                labelPlacement="outside"
                placeholder="Deskripsi Produk"
                className="max-w-xl"
                variant="bordered"
                name="description"
                value={saveProductRequest.description}
                onChange={handleInputChange}
                isInvalid={!!errors.description}
                errorMessage={errors.description ? errors.description[0] : ""}
              />
              <Input
                label="Harga"
                variant="bordered"
                name="price"
                value={saveProductRequest.price}
                onChange={handleInputChange}
                isInvalid={!!errors.price}
                errorMessage={errors.price ? errors.price[0] : ""}
              />
              <Input
                label="Stock"
                variant="bordered"
                name="stock"
                value={saveProductRequest.stock}
                onChange={handleInputChange}
                isInvalid={!!errors.stock}
                errorMessage={errors.stock ? errors.stock[0] : ""}
              />
              <Input
                label="SKU"
                variant="bordered"
                name="sku"
                value={saveProductRequest.sku}
                onChange={handleInputChange}
                isInvalid={!!errors.sku}
                errorMessage={errors.sku ? errors.sku[0] : ""}
              />
              <Input
                label="Diproduksi Oleh"
                variant="bordered"
                name="produced_by"
                value={saveProductRequest.produced_by}
                onChange={handleInputChange}
                isInvalid={!!errors.produced_by}
                errorMessage={errors.produced_by ? errors.produced_by[0] : ""}
              />
              <Select
                label="Status"
                placeholder="Pilih status produk"
                className="max-w-full"
                onChange={(value) => handleSelectChange("status", value)}
                isInvalid={!!errors.status}
              >
                <SelectItem key="ACTIVE" value="ACTIVE">Aktif</SelectItem>
                <SelectItem key="INACTIVE" value="INACTIVE">Non-Aktif</SelectItem>
              </Select>
              {errors.status && <p className="text-red-500">{errors.status[0]}</p>}
              <Select
                label="Kategori Produk"
                placeholder="Pilih salah satu kategori"
                className="max-w-full"
                onChange={(value) => handleSelectChange("category_id", value)}
                isInvalid={!!errors.category_id}
              >
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
              {errors.category_id && <p className="text-red-500">{errors.category_id[0]}</p>}
              <FileUploader
                handleChange={handleFileChange}
                name="images"
                types={['png', 'jpeg', 'jpg']}
                multiple // Allow multiple file uploads
              />
              {errors.file && <p className="text-red-500">{errors.file[0]}</p>}
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
    </>
  );
};