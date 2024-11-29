import  { useState, useEffect } from "react";
import axiosInstance from "../../../Utils/axios";
import toast from "react-hot-toast";
import DeleteBtn from "../../../Components/DeleteBtn";
import { FaPencilAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
const CategoryDataSection = () => {
  const [categories, setCategories] = useState([]);
  const [editData, setEditData] = useState({ name: "", icon: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const GlobalSlice = useSelector(state=>state.GlobalSlice);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/blogs/allCategories");
        setCategories(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching categories");
      }
    };

    fetchCategories();
  }, [GlobalSlice]);

  const handleEditClick = (category) => {
    setSelectedCategoryId(category._id);
    setEditData({ name: category.name, icon: category.icon });
    setIsEditModalOpen(true);
  };



  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      if (editData.icon instanceof File) {
        formData.append("icon", editData.icon);
      }

     const response= await axiosInstance.put(
        `/api/blogs/editCategory/${selectedCategoryId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

console.log(response);
      setCategories(
        categories.map((category) =>
          category._id === selectedCategoryId
            ? { ...category, name:response.data.name,icon:response.data.icon}
            : category
        )
      );

      toast.success("Category updated successfully");
      setIsEditModalOpen(false);
      setEditData({ name: "", icon: "" });
    } catch (err) {
      console.error(err);
      toast.error("Error updating category");
    }
  };

  return (
    <div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="border rounded-lg p-4 bg-white shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-12 h-12 mb-2"
                />
                <h4 className="text-lg font-medium">{category.name}</h4>
                <p className="text-sm text-gray-500">
                  Created by: {category.createdBy.name}
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleEditClick(category)}
                  className="mt-[7px] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm py-[10px] px-[12px] mb-2 "
                >
                  <FaPencilAlt />
                </button>

                <DeleteBtn
                  id={category._id}
                  route={"blogs/categories"}
                  name="Category"
                />
              </div>
            </div>
            {/* <button
              onClick={() => handleDeleteClick(category._id)}
              className="text-red-500 hover:text-red-700 mt-2"
            >
              Delete
              </button> */}
          </div>
        ))}
      </div>

      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Category
            </h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="icon"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Icon
                </label>
                <input
                  type="file"
                  id="icon"
                  onChange={(e) =>
                    setEditData({ ...editData, icon: e.target.files[0] })
                  }
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDataSection;
