import { useNavigate, useParams } from "react-router-dom";

import CategoryForm, {
  type CategoryFormData,
} from "../../../components/admin/category/CategoryForm";

import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../../store/api/categoryApi";

import { showToast } from "../../../utils/toast";
import { getApiErrorMessage } from "../../../utils/apiError";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const categoryId = Number(id);

  const {
    data,
    isLoading: isFetching,
    isError,
    error,
  } = useGetCategoryByIdQuery(categoryId, {
    skip: !id || Number.isNaN(categoryId),
  });

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const handleUpdateCategory = async (formData: CategoryFormData) => {
    try {
      const response = await updateCategory({
        id: categoryId,
        data: formData,
      }).unwrap();
      showToast(response.message, "success", () => {
        navigate("/admin/categories");
      });
      navigate("/admin/categories");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };

  if (isFetching) {
    return <div>Loading category...</div>;
  }

  if (isError) {
    return (
      <div>
        <h2>Unable to load category</h2>
        <p>{getApiErrorMessage(error)}</p>
      </div>
    );
  }

  const category = data?.data;

  if (!category) {
    return <div>Category not found.</div>;
  }

  const initialData: CategoryFormData = {
    category_name: category.category_name,
    category_image: category.category_image,
    category_slogan: category.category_slogan,
  };

  return (
    <CategoryForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleUpdateCategory}
      isLoading={isUpdating}
    />
  );
};

export default EditCategory;
