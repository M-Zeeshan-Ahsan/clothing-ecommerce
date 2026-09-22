import ProductForm, {
  type ProductFormData,
} from "../../../components/admin/product/ProductForm";

const AddProduct = () => {
  const handleAddProduct = (data: ProductFormData) => {
    console.log("Add Product:", data);

    // API yahan lagegi
    // POST /api/admin/products
  };

  return <ProductForm mode="add" onSubmit={handleAddProduct} />;
};

export default AddProduct;
