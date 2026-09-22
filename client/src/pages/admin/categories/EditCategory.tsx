import { useParams } from "react-router-dom";

import CategoryForm, {
  type CategoryFormData,
} from "../../../components/admin/category/CategoryForm";

const EditCategory = () => {
  const { id } = useParams();

  const category: CategoryFormData = {
    name: "Lawn",
    slug: "lawn",
    status: "Active",
    description: "Premium lawn collection for ladies.",
  };

  const handleUpdateCategory = (data: CategoryFormData) => {
    console.log("Category ID:", id);
    console.log("Update Category Data:", data);

    // PUT /api/admin/categories/:id later
  };

  return (
    <CategoryForm
      mode="edit"
      initialData={category}
      onSubmit={handleUpdateCategory}
    />
  );
};

export default EditCategory;
