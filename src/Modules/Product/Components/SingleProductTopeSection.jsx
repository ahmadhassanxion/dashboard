import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axiosInstance from "../../../Utils/axios";
import { useNavigate } from "react-router-dom";
import { updateGlobal } from "../../Global/GlobalSlice";
import { TagsInput } from "react-tag-input-component";
import {format} from "timeago.js";
import { showSuccessAlert, showErrorAlert } from "../../../Utils/SwalAlert";
import { FaDownload, FaPlus, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

const SingleProductTopeSection = () => {
    const product = useSelector(state => state.SingleProductSlice);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const UserData = JSON.parse(localStorage.getItem("userData"));
    const [editedProduct, setEditedProduct] = useState({
        name: product?.name || "",
        description: product?.description || "",
        screenshot: product?.screenshot || "",
        type: product?.type || "",
        tone: product?.tone || "",
        category: product?.category || "",
        price: product?.price || 0,
        status: product?.status || "Pending",
        published: product?.published || false,
        screenshotFile: null
    });
    const [newItem, setNewItem] = useState({
        name: "",
        file: null,
        tags: [],
        type: product?.type || "",
        category: product?.category || "",
        tone: product?.tone || "",
        status: "active"
    });

    const handleEdit = () => {
        setEditedProduct({
            name: product?.name || "",
            description: product?.description || "",
            screenshot: product?.screenshot || "",
            type: product?.type || "",
            tone: product?.tone || "",
            category: product?.category || "",
            price: product?.price || 0,
            status: product?.status || "Pending",
            published: product?.published || false,
            screenshotFile: null
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            let screenshotUrl = editedProduct.screenshot;
            
            // If there's a new screenshot file, upload it first
            if (editedProduct.screenshotFile) {
                const formData = new FormData();
                formData.append('file', editedProduct.screenshotFile);
                
                const uploadResponse = await axiosInstance.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (uploadResponse.data && uploadResponse.data.url) {
                    screenshotUrl = uploadResponse.data.url;
                } else {
                    throw new Error('Failed to get upload URL');
                }
            }

            const response = await axiosInstance.put(`/api/products/updateProduct/${product._id}`, {
                ...editedProduct,
                screenshot: screenshotUrl
            });

            if (response.status === 200) {
                dispatch(updateGlobal({ product: response.data }));
                setShowEditModal(false);
                showSuccessAlert("Product updated successfully!");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            showErrorAlert(error.response?.data?.message || error.message || "Failed to update product");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axiosInstance.delete(`/api/products/deleteProduct/${product._id}`);
                showSuccessAlert("Product deleted successfully!");
                navigate("/products"); // Redirect to products page
            } catch (error) {
                showErrorAlert("Failed to delete product");
            }
        }
    };

    const handleDownload = async () => {
        try {
            // Create a zip file of all item files
            const response = await axiosInstance.get(`/api/products/downloadProduct/${product._id}`, {
                responseType: 'blob'
            });
            
            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${product.name}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            showSuccessAlert("Download started!");
        } catch (error) {
            showErrorAlert("Failed to download files");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddItem = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newItem.name);
            formData.append('tags', JSON.stringify(newItem.tags));
            if (newItem.file) {
                formData.append('file', newItem.file);
            }
            formData.append('type', product.type);
            formData.append('category', product.category);
            formData.append('tone', product.tone);
            formData.append('status', newItem.status);
            formData.append('uploadedBy', UserData._id);
            formData.append('productId', product._id);

            const response = await axiosInstance.post('/api/items/createItem', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                showSuccessAlert("Item added successfully!");
                // Trigger a global update to refresh the product data
                dispatch(updateGlobal());
                setShowAddItemModal(false);
                setNewItem({
                    name: "",
                    file: null,
                    tags: [],
                    type: product?.type || "",
                    category: product?.category || "",
                    tone: product?.tone || "",
                    status: "active"
                });
            }
        } catch (error) {
            showErrorAlert(error.response?.data?.error || "Failed to add item");
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 mb-8 relative">
            <h1 className="text-2xl font-bold mb-4">
                {product?.name || "Loading..."}
            </h1>
            <p className="text-gray-700 mb-2">
                {product?.description || "Loading..."}
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">Type:</span>
                    <span className="text-gray-600">{product?.type || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">Tone:</span>
                    <span className="text-gray-600">{product?.tone || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">Category:</span>
                    <span className="text-gray-600">{product?.category || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">CreatedBy:</span>
                    <span className="text-gray-600">
                        {product?.createdBy?.name || "N/A"}
                    </span>
                </div>
            </div>

            {/* Screenshot Display */}
            {product?.screenshot && (
                <div className="mt-6 absolute top-0 right-10">
            
                    <div className="relative w-full max-w-2xl">
                        <img 
                            src={product.screenshot} 
                            alt="Product Screenshot" 
                            className="rounded-lg shadow-md w-full h-auto max-w-[180px]"
                        />
                    </div>
                </div>
            )}
</div>
            <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">Price:</span>
                    <span className="text-gray-600">{product?.price || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">Status:</span>
                    <span className="text-gray-600">{product?.status || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">Published:</span>
                    <span className="text-gray-600">{product?.published? "Yes" : "No" || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">   
                    <span className="font-semibold text-gray-800">Updated:</span>
                    <span className="text-gray-600">{format(product?.updatedAt) || "N/A"}</span>
                </div>
                
                </div>

            <div className="flex justify-end space-x-4 mt-6">
                <button 
                    onClick={() => setShowAddItemModal(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                    <FaPlus />
                    
                </button>
                <button 
                    onClick={handleEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    <FaEdit />
              
                </button>
                <button 
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    <FaTrash />
                   
                </button>
                <button 
                    onClick={handleDownload}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
                >
                    <FaDownload />
                    
                </button>
            </div>
            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editedProduct.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={editedProduct.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Screenshot Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Screenshot
                                </label>
                                <div className="space-y-2">
                                    {editedProduct.screenshot && (
                                        <div className="relative w-full max-w-md">
                                            <img 
                                                src={editedProduct.screenshot} 
                                                alt="Current Screenshot" 
                                                className="rounded-lg shadow-sm w-full h-auto mb-2"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setEditedProduct(prev => ({
                                                    ...prev,
                                                    screenshotFile: file
                                                }));
                                            }
                                        }}
                                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Supported formats: JPG, PNG, GIF, SVG. Max size: 60MB
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <input
                                    type="text"
                                    name="type"
                                    value={editedProduct.type}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tone
                                </label>
                                <input
                                    type="text"
                                    name="tone"
                                    value={editedProduct.tone}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    value={editedProduct.category}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={editedProduct.price}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={editedProduct.status}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="published"
                                    checked={editedProduct.published}
                                    onChange={(e) => setEditedProduct(prev => ({
                                        ...prev,
                                        published: e.target.checked
                                    }))}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">
                                    Published
                                </label>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Item Modal */}
            {showAddItemModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">File</label>
                                <input
                                    type="file"
                                    onChange={(e) => setNewItem({ ...newItem, file: e.target.files[0] })}
                                    className="mt-1 block w-full"
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                <TagsInput
                                    value={newItem.tags}
                                    onChange={(tags) => setNewItem({ ...newItem, tags })}
                                    placeHolder="Enter tags"
                                />
                                <span className="text-sm text-gray-500">Press enter to add tags</span>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Type:</span> {product.type}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Category:</span> {product.category}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Tone:</span> {product.tone}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAddItemModal(false)}
                                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddItem}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SingleProductTopeSection;