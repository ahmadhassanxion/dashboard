import { useState } from "react";
import axiosInstance from "../../../Utils/axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateGlobal } from "../../Global/GlobalSlice";

const AddBlogWebsite = () => {
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();
  const [data, setData] = useState({
    name: "",
    link: "",
  });
  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("link", data.link);
      formData.append("createdBy", userData._id);
      const response = await  axiosInstance.post('/api/blogs/createWebsite', formData);

console.log(response);
toast.success("Website created successfully");
setData({
  name:'',
  link:""
})
dispatch(updateGlobal());
setToggle(!toggle);
    }catch(err){
console.log(err);
toast.error("Error while processing request");
    }
  
  };

  return (
    <div>
      <button
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        type="button"
        onClick={() => setToggle(!toggle)}
      >
        Add Blog Website
      </button>

      {toggle && (
        <div
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full bg-[rgba(0,0,0,0.4)] flex"
          onClick={() => setToggle(false)}
        >
          <div
            className="relative p-4 w-full max-w-xl bg-white rounded-lg shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Blog Website
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                onClick={() => setToggle(false)}
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
                    d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type Blog Category"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="icon"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Website Link
                  </label>
                  <input
                    type="text"
                    name="link"
                    id="link"
                    onChange={(e) => setData({ ...data, link: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type Blog Website"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
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
                Create New Blog Website
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBlogWebsite
