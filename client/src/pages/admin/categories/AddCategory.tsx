import CategoryForm, {
  type CategoryFormData,
} from "../../../components/admin/category/CategoryForm";

const AddCategory = () => {
  const handleAddCategory = (data: CategoryFormData) => {
    console.log("Add Category Data:", data);

    // Category API later
  };

  return <CategoryForm mode="add" onSubmit={handleAddCategory} />;
};

export default AddCategory;
