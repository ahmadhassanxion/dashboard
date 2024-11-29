import { useSelector } from "react-redux";

const SingleProductTopeSection = () => {
    const product = useSelector(state=>state.SingleProductSlice)
    console.log(product);
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h1 className="text-2xl font-bold mb-4">
        {product?.name || "Loading..."}
      </h1>
      <p className="text-gray-700 mb-2">
        {product?.description || "Loading..."}
      </p>
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
            {product?.createdBy.name || "N/A"}
          </span>
        </div>
        <div className="flex items-center space-x-2 flex-1 justify-end items-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
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
    </div>
  );
}

export default SingleProductTopeSection