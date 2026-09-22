import { useParams } from "react-router-dom";

import ProductForm, {
  type ProductFormData,
} from "../../../components/admin/product/ProductForm";

const EditProduct = () => {
  const { id } = useParams();

  // Temporary data.
  // Later this product will come from API.
  const product: ProductFormData = {
    name: "Nishat Boski Suit",
    category: "Boski",
    price: "5480",
    stock: "12",

    imageUrl:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",

    imageFile: null,

    description: "Premium quality Nishat Boski suit.",
  };

  const handleUpdateProduct = (data: ProductFormData) => {
    console.log("Product ID:", id);
    console.log("Update Product Data:", data);

    if (data.imageFile) {
      console.log("New Image File:", data.imageFile);
    }

    // If imageFile exists:
    // 1. Upload new image to AWS
    // 2. Get AWS URL
    // 3. Update product with new URL

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
