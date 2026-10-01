import { useNavigate } from "react-router-dom";

import ProductForm, {
  type ProductFormData,
} from "../../../components/admin/product/ProductForm";

import { useCreateProductMutation } from "../../../store/api/productApi";
import { useUploadImageMutation } from "../../../store/api/uploadApi";

import { getApiErrorMessage } from "../../../utils/apiError";
import { showToast } from "../../../utils/toast";

const AddProduct = () => {
  const navigate = useNavigate();

  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const isSubmitting = isUploading || isCreating;

  const handleAddProduct = async (data: ProductFormData) => {
    try {
      // =========================
      // IMAGE REQUIRED
      // =========================

      if (!data.imageFile) {
        showToast("Product image is required", "error");

        return;
      }

      // =========================
      // CREATE FORMDATA
      // =========================

      const formData = new FormData();

      formData.append("image", data.imageFile);

      // =========================
      // UPLOAD IMAGE
      // =========================

      const uploadResponse = await uploadImage(formData).unwrap();

      const imageUrl = uploadResponse.data.url;

      // =========================
      // CREATE PRODUCT
      // =========================

      await createProduct({
        product_name: data.name,
        product_image: imageUrl,
        categoryId: Number(data.category),
        price: Number(data.price),
        stock: Number(data.stock),
        sale_price: data.salePrice !== "" ? Number(data.salePrice) : null,
      }).unwrap();

      // =========================
      // SUCCESS
      // =========================

      showToast("Product added successfully", "success");

      navigate("/admin/products");
    } catch (error) {
      console.error("Add product error:", error);

      showToast(getApiErrorMessage(error), "error");
    }
  };

  return (
    <ProductForm
      mode="add"
      onSubmit={handleAddProduct}
      isSubmitting={isSubmitting}
    />
  );
};

export default AddProduct;
