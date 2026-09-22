import ProductForm, {
  type ProductFormData,
} from "../../../components/admin/product/ProductForm";

const AddProduct = () => {
  const handleAddProduct = (data: ProductFormData) => {
    console.log("Add Product Data:", data);

    if (data.imageFile) {
      console.log("Image File to Upload:", data.imageFile);
    }

    // AWS upload API later
    // Product API later
  };

  return <ProductForm mode="add" onSubmit={handleAddProduct} />;
};

export default AddProduct;
