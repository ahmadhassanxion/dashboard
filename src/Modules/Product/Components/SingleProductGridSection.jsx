import { useState } from "react";
import { useSelector } from "react-redux";
import ItemEditForm from "./ItemEditForm";

const SingleProductGridSection = () => {
  const product = useSelector((state) => state.SingleProductSlice);
  const [toggle, setToggle] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setToggle(true);
  };

  const handleSave = () => {
    // Logic to refresh or update the view after an item is edited
    setToggle(false); // Close the modal after saving
  };

  return (
    <div className="bg-gray-200 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {product?.items?.map((item) => (
        <div
          key={item._id}
          className="relative flex flex-col justify-between group bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <img
            src={item.file}
            alt={item.name}
            className="w-full max-w-[94%] h-40 object-contain m-2"
          />
          <div className="p-4 bg-gray-100">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-600 mt-1 font-semibold">
              Tags: {item.tags.join(", ")}
            </p>
            <h2 className="text-lg font-semibold">{item.uploadedBy.name}</h2>
          </div>
          {/* Edit and Delete Buttons */}
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => handleEditClick(item)}
            >
              Edit
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
              Delete
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition">
              Download
            </button>
          </div>
        </div>
      ))}
      {toggle && selectedItem && (
        <ItemEditForm
          item={selectedItem}
          toggle={toggle}
          setToggle={setToggle}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default SingleProductGridSection;
