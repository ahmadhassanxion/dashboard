import { useState, useEffect, useRef, useMemo } from "react";
import axiosInstance from "../../../Utils/axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import JoditEditor from "jodit-react";
import { updatePost } from "../SinglePostSlice";

const BlogEditForm = () => {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.SinglePostSlice); // Assuming singlePost is your redux slice
  const editor = useRef(null);
  const [allCategories, setAllCategories] = useState([]);
  const [content, setContent] = useState("");
  console.log(post);
  const [data, setData] = useState({
    name: "",
    category: "",
    status: "",
  
    comments: false,
  });

  // Fetch categories on component mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/blogs/allCategories");
        setAllCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    getCategories();
  }, []);

  // Initialize form data with existing post data
  useEffect(() => {
    if (post) {
      setData({
        name: post.name || "",
        category: post.category?._id || "",
        status: post.status || "",
      
        comments: post.comments || false,
      });
      setContent(post.content || "");
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!data.name || !content || !data.category) {
        toast.error("Please fill all required fields.");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("content", content);
      formData.append("category", data.category);
      formData.append("status", data.status);
    
      formData.append("comments", data.comments);

      const response = await axiosInstance.put(
        `/api/blogs/updatePost/${post._id}`,
        formData
      );

      if (response.data.status === 402) {
        toast.error("Blog with this name already exists!");
      } else {
        toast.success("Blog updated successfully!");
        dispatch(updatePost(response.data));
      }
    } catch (err) {
      toast.error("Error while updating blog!");
      console.log(err);
    }
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      height: 500,
    }),
    []
  );

  return (
    <div className="relative px-4 w-full  max-h-full">
      <div className="relative h-full bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900">Edit Blog</h3>
        </div>

        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Type blog name"
                required
              />
            </div>
            <div className="col-span-1">
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                required
              >
                <option value="">Select Status</option>
                <option value="draft">Draft</option>
                <option value="publish">Publish</option>
              </select>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={data.category}
                onChange={(e) => setData({ ...data, category: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                required
              >
                <option value="">Select Category</option>
                {allCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label
                htmlFor="editor"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Content
              </label>
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={(newContent) => setContent(newContent)}
                onChange={(newContent) => setContent(newContent)}
              />
            </div>

          

            <div className="col-span-2 flex items-center">
              <input
                type="checkbox"
                name="comments"
                id="comments"
                checked={data.comments}
                onChange={(e) =>
                  setData({ ...data, comments: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="comments"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                Allow Comments
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Update Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogEditForm;
