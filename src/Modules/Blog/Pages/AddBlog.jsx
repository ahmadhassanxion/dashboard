import { useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "../../../Utils/axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateGlobal } from "../../Global/GlobalSlice";
import JoditEditor from "jodit-react";

const AddBlog = () => {
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();
  const [allCategories, setAllCategories] = useState([]);
  const editor = useRef(null); // Reference for the editor
  const [content, setContent] = useState(""); // State for editor content
  const userData = JSON.parse(localStorage.getItem("userData"));
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/blogs/allCategories"
        );
        console.log(response.data);
        setAllCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    getCategories();
  }, []);

  const [data, setData] = useState({
    title: "",
    category: "",
    status: "",
    featuredImage: null,
    allowComments: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validation for empty fields
      if (!data.title || !content || !data.category || !data.featuredImage) {
        toast.error("Please fill all required fields.");
        return;
      }

      // FormData to handle file uploads and other data
      const formData = new FormData();
      formData.append("name", data.title);
      formData.append("content", content);
      formData.append("category", data.category);
      formData.append("status", data.status);
      formData.append("image", data.featuredImage);
      formData.append("comments", data.allowComments);
      formData.append("createdBy", userData._id);


      const response = await axiosInstance.post(
        "/api/blogs/createPost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      if (response.data.status === 402) {
        toast.error("Blog with this title already exists!");
      } else {
        // Reset form data
        setData({
          title: "",
          category: "",
          status: "",
          featuredImage: null,
          allowComments: false,
        });
        setContent(""); // Reset editor content
        toast.success("Blog created successfully!");
        dispatch(updateGlobal());
        setToggle(!toggle);
      }
    } catch (err) {
      toast.error("Error while creating blog!");
      console.log(err);
    }
  };

 const config = useMemo(
   () => ({
     readonly: false, // all options from https://xdsoft.net/jodit/docs/,
     placeholder: "Start typing...",
     height: 500, // Set the desired height in pixels
   }),
   []
 );

  return (
    <div>
      <button
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  shadow-lg shadow-blue-500/50  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        type="button"
        onClick={() => setToggle(!toggle)}
      >
        Add Blog
      </button>

      <div
        className={`${
          toggle ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full bg-[rgba(0,0,0,0.4)]`}
      >
        <div className="relative p-4 w-full max-w-[70%] max-h-full">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
              <h3 className="text-lg font-semibold text-gray-900 ">
                Create New Blog
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
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    onChange={(e) =>
                      setData({ ...data, title: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="Type blog title"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="status"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    onChange={(e) =>
                      setData({ ...data, status: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                  >
                    <option value="">Select Status</option>
                    <option value="draft">Draft</option>
                    <option value="publish">Publish</option>
                    =
                  </select>
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    onChange={(e) =>
                      setData({ ...data, category: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                  >
                    <option value="">Select Category</option>
                    {allCategories.map((category, index) => (
                      <option key={index} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="editor"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Content
                  </label>
                  <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1} // tabIndex of textarea
                    onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    onChange={(newContent) => setContent(newContent)}
                  />
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="featuredImage"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Featured Image
                  </label>
                  <input
                    type="file"
                    name="featuredImage"
                    id="featuredImage"
                    onChange={(e) =>
                      setData({ ...data, featuredImage: e.target.files[0] })
                    }
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none  p-2.5"
                    required
                  />
                </div>

                <div className="col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    name="allowComments"
                    id="allowComments"
                    checked={data.allowComments}
                    onChange={(e) =>
                      setData({ ...data, allowComments: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500  "
                  />
                  <label
                    htmlFor="allowComments"
                    className="ml-2 text-sm font-medium text-gray-900 "
                  >
                    Allow Comments
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  shadow-lg shadow-blue-500/50   font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
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
                Create New Blog
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
