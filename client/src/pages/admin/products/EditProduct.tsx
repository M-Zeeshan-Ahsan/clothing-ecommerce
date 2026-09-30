import { useNavigate, useParams } from "react-router-dom";

import ProductForm, {
  type ProductFormData,
} from "../../../components/admin/product/ProductForm";

import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../store/api/productApi";

import { useUploadImageMutation } from "../../../store/api/uploadApi";

import { getApiErrorMessage } from "../../../utils/apiError";
import { showToast } from "../../../utils/toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const productId = Number(id);

  // =========================
  // GET PRODUCT
  // =========================

  const {
    data: productResponse,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductByIdQuery(productId, {
    skip: !id || Number.isNaN(productId),
  });

  // =========================
  // UPLOAD IMAGE
  // =========================

  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  // =========================
  // UPDATE PRODUCT
  // =========================

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // =========================
  // PRODUCT DATA
  // =========================

  const product = productResponse?.data;

  // =========================
  // UPDATE
  // =========================

  const handleUpdateProduct = async (data: ProductFormData) => {
    try {
      let imageUrl = data.imageUrl;

      // =========================
      // NEW IMAGE
      // =========================

      if (data.imageFile) {
        const formData = new FormData();

        formData.append("image", data.imageFile);

        const uploadResponse = await uploadImage(formData).unwrap();

        imageUrl = uploadResponse.data.url;
      }

      // =========================
      // UPDATE PRODUCT
      // =========================

      await updateProduct({
        id: productId,

        product_name: data.name,
        product_image: imageUrl,
        categoryId: Number(data.category),
        price: Number(data.price),

        sale_price: data.salePrice !== "" ? Number(data.salePrice) : null,
      }).unwrap();

      // =========================
      // SUCCESS
      // =========================

      showToast("Product updated successfully", "success");

      navigate("/admin/products");
    } catch (error) {
      console.error("Update product error:", error);

      showToast(getApiErrorMessage(error), "error");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (isProductLoading) {
    return <p>Loading product...</p>;
  }

  // =========================
  // ERROR
  // =========================

  if (isProductError || !product) {
    return <p>Product not found.</p>;
  }

  // =========================
  // INITIAL DATA
  // =========================

  const initialData: ProductFormData = {
    name: product.product_name,
    category: String(product.categoryId),
    price: String(product.price),
    salePrice:
      product.sale_price !== null && product.sale_price !== undefined
        ? String(product.sale_price)
        : "",
    imageUrl: product.product_image,
    imageFile: null,
  };

  return (
    <ProductForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleUpdateProduct}
      isSubmitting={isUploading || isUpdating}
    />
  );
};

export default EditProduct;
