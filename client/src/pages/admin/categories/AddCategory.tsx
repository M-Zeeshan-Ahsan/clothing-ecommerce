import { useNavigate } from "react-router-dom";

import CategoryForm, {
  type CategoryFormData,
} from "../../../components/admin/category/CategoryForm";

import { useCreateCategoryMutation } from "../../../store/api/categoryApi";

import { showToast } from "../../../utils/toast";
import { getApiErrorMessage } from "../../../utils/apiError";

const AddCategory = () => {
  const navigate = useNavigate();

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleAddCategory = async (data: CategoryFormData) => {
    try {
      const response = await createCategory(data).unwrap();

      showToast(response.message, "success", () => {
        navigate("/admin/categories");
      });
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };

  return (
    <CategoryForm
      mode="add"
      onSubmit={handleAddCategory}
      isLoading={isLoading}
    />
  );
};

export default AddCategory;
