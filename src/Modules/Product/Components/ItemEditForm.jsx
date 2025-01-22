/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { TagsInput } from "react-tag-input-component";
import axiosInstance from "../../../Utils/axios";
import { updateGlobal } from "../../Global/GlobalSlice";
import { showSuccessAlert, showErrorAlert } from "../../../Utils/SwalAlert";

const ItemEditForm = ({ item, toggle, setToggle, onClose,tone,category,type }) => {
  const [editedItem, setEditedItem] = useState(item);
  const dispatch = useDispatch();

  const handleItemChange = (e) => {
    const { name, value, type, files } = e.target;
    setEditedItem({
      ...editedItem,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleTagChange = (newTags) => {
    setEditedItem({ ...editedItem, tags: newTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editedItem.name.trim()) {
      showErrorAlert("Item name is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editedItem.name);
      // Send tags as an array instead of a stringified array
      editedItem.tags.forEach(tag => {
        formData.append("tags[]", tag);
      });
      formData.append("tone", tone);
      formData.append("category", category);
      formData.append("type", type);

      if (editedItem.file) {
        formData.append("file", editedItem.file);
      }

      const response = await axiosInstance.put(
        `/api/items/updateItem/${item._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        showSuccessAlert("Item updated successfully!");
        dispatch(updateGlobal());
        setToggle(false);
      } else {
        showErrorAlert("Failed to update item.");
      }
    } catch (error) {
      showErrorAlert("Error while updating item.");
    }
  };

  return (
    <div
      id="edit-item-modal"
      tabIndex="-1"
      aria-hidden="true"
      className={`${
        toggle ? "flex" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full bg-[rgba(0,0,0,0.4)]`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow ">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
            <h3 className="text-lg font-semibold text-gray-900 ">Edit Item</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center  "
              onClick={() => setToggle(!toggle)}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4">
              <div>
                <label
                  htmlFor="item-name"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="item-name"
                  value={editedItem.name}
                  onChange={handleItemChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Item Name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="item-tags"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Tags
                </label>
                <TagsInput
                  value={editedItem.tags}
                  onChange={handleTagChange}
                  name="tags"
                  placeHolder="Add a tag"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                />
              </div>

              <div>
                <label
                  htmlFor="item-file"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  File
                </label>
                <input
                  type="file"
                  name="file"
                  id="item-file"
                  onChange={handleItemChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 
                  focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemEditForm;
