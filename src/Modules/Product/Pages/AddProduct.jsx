import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Utils/axios";
import { showSuccessAlert, showErrorAlert } from "../../../Utils/SwalAlert";
import { useDispatch } from "react-redux";
import { updateGlobal } from "../../Global/GlobalSlice";
import CustomTagsInput from "../Components/CustomTagInput";

const AddProduct = () => {
  const [toggle, setToggle] = useState(false);
  const UserData = JSON.parse(localStorage.getItem("userData"));
  const userId = UserData._id;
  // console.log(UserData._id);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState(["icon", "illustration"]);
  const [allUsers, setAllUsers] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    slug:"",
    tone: "",
    type: "",
    category: "",
    items: [],
  });

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value, type, files } = e.target;
    const updatedItems = [...product.items];
    if (type === "file") {
      updatedItems[index][name] = files[0];
    } else {
      updatedItems[index][name] = value;
    }
    setProduct({ ...product, items: updatedItems });
  };

  const handleTagChange = (index, newTags) => {
    const updatedItems = [...product.items];
    updatedItems[index].tags = newTags;
    setProduct({ ...product, items: updatedItems });
  };

  const addItemSection = () => {
    setProduct({
      ...product,
      items: [
        ...product.items,
        { 
          name: "", 
          slug: "",
          tags: [], 
          file: null, 
          uploadedBy: userId,
          type: product.type,
          category: product.category,
          status: "active",
          tone: product.tone,
        }, 
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate product fields
      if (
        !product.name ||
        
        !product.description ||
        !product.tone ||
        !product.type ||
        !product.category
      ) {
        showErrorAlert("Please fill all product fields");
        return;
      }

      if (product.slug === "") {
        product.slug = product.name.toLowerCase().replace(/\s+/g, '-');
      }

      if (product.items.length === 0) {
        showErrorAlert("Please add at least one item");
        return;
      }

      // Create a FormData object to prepare data for the product
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("slug", product.slug);
      formData.append("userId", UserData._id);
      formData.append("description", product.description);
      formData.append("tone", product.tone);
      formData.append("type", product.type);
      formData.append("category", product.category);

      // Array to store item IDs
      let itemIds = [];

      // Create all items and collect their IDs
      await Promise.all(
        product.items.map(async (item) => {
          // Prepare form data for each item separately
          const itemFormData = new FormData();
          itemFormData.append("name", item.name);

          itemFormData.append("uploadedBy", item.uploadedBy);
          itemFormData.append("type", product.type);
          itemFormData.append("category", product.category);
          itemFormData.append("status", "active");
          itemFormData.append("tone", product.tone);
          item.tags.forEach((tag, tagIndex) => {
            itemFormData.append(`tags[${tagIndex}]`, tag);
          });
          if (item.file) {
            itemFormData.append("file", item.file);
          }

          // Send request to create an item
          const response = await axiosInstance.post(
            "/api/items/createItem",
            itemFormData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          console.log(response);

          // Collect the item ID from response
          itemIds.push(response.data._id); // Assuming response.data.itemId contains the created item ID
        })
      );

      // After all items are created, add their IDs to the product form data
      itemIds.forEach((itemId, index) => {
        formData.append(`items[${index}]`, itemId);
      });

      // Submit the product with all collected item IDs
      const response = await axiosInstance.post(
        "/api/products/createProduct",
        formData,
        {
          // No need to manually set headers here
        }
      );

      if (response.data.status === 402) {
        showErrorAlert("Error in creating product!");
      } else {
        showSuccessAlert("Product Created Successfully!");
        dispatch(updateGlobal());
        setToggle(false);
        setProduct({
          name: "",
          slug: "",
          description: "",
          tone: "",
          type: "",
          category: "",
          items: [],
        });
      }
    } catch (err) {
      showErrorAlert("Error While Creating Product!");
      console.log(err);
    }
  };

  return (
    <div>
      <button
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  shadow-lg shadow-blue-500/50  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        type="button"
        onClick={() => setToggle(!toggle)}
      >
        Add Product
      </button>

      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden="true"
        className={`${
          toggle ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full bg-[rgba(0,0,0,0.4)]`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
              <h3 className="text-lg font-semibold text-gray-900 ">
                Create New Product
              </h3>
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
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={product.name}
                    onChange={handleProductChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                    placeholder="Product Name"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="slug"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    value={product.slug}
                    onChange={handleProductChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                    placeholder="Product Slug"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={product.description}
                    onChange={handleProductChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                    placeholder="Product Description"
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="tone"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Tone
                  </label>
                  <select
                    name="tone"
                    id="tone"
                    value={product.tone}
                    onChange={handleProductChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required
                  >
                    <option value="">Select Tone</option>
                    <option value="standard">Standard</option>
                    <option value="flat">Flat</option>
                    <option value="isometric">Isometric</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="type"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={product.type}
                    onChange={handleProductChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="solid">Solid</option>
                    <option value="semiSolid">Semi-Solid</option>
                    <option value="stroke">Stroke</option>
                    <option value="line">Line</option>
                    <option value="colorLine">ColorLine</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={product.category}
                    onChange={handleProductChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {product.items.map((item, index) => (
                <div key={index} className="border p-4 mb-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">
                    Item {index + 1}
                  </h4>

                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor={`item-name-${index}`}
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id={`item-name-${index}`}
                        value={item.name}
                        onChange={(e) => handleItemChange(index, e)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                        placeholder="Item Name"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor={`item-tags-${index}`}
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Tags
                      </label>
                      <CustomTagsInput
                        value={item.tags}
                        onChange={(newTags) => handleTagChange(index, newTags)}
                        placeHolder="Enter tags (use comma to separate)"
                      />
                      <span className="text-sm text-gray-500">Press enter or comma to add tags</span>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor={`item-file-${index}`}
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        File
                      </label>
                      <input
                        type="file"
                        name="file"
                        id={`item-file-${index}`}
                        onChange={(e) => handleItemChange(index, e)}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 
                         focus:outline-none  "
                      />
                    </div>

                   
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addItemSection}
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Add New Item
              </button>

              <button
                type="submit"
                className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  shadow-lg shadow-blue-500/50  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                <svg
                  className="w-4 h-4 mr-2 -ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Create New Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
