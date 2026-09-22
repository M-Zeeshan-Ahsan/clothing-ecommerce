import { useParams } from "react-router-dom";

import ProductForm, {
  type ProductFormData,
} from "../../../components/admin/product/ProductForm";

const EditProduct = () => {
  const { id } = useParams();

  // Temporary dummy data
  // API integration ke waqt yahan product API se ayega.
  const product: ProductFormData = {
    name: "Nishat Boski Suit",
    category: "Boski",
    price: "5480",
    stock: "12",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
    description: "Premium quality Nishat Boski suit.",
  };

  const handleUpdateProduct = (data: ProductFormData) => {
    console.log("Product ID:", id);
    console.log("Update Product:", data);

    // API yahan lagegi
    // PUT /api/admin/products/:id
  };

  return (
    <ProductForm
      mode="edit"
      initialData={product}
      onSubmit={handleUpdateProduct}
    />
  );
};

export default EditProduct;
