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
  const [allWebsites, setAllWebsites] = useState([]);
  const editor = useRef(null); // Reference for the editor
  const [content, setContent] = useState(""); // State for editor content
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, websitesRes] = await Promise.all([
          axiosInstance.get("/api/blogs/allCategories"),
          axiosInstance.get("/api/blogs/allWebsites")
        ]);
        setAllCategories(categoriesRes.data);
        setAllWebsites(websitesRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch required data");
      }
    };
    fetchData();
  }, []);

  const [data, setData] = useState({
    title: "",
    slug: "",
    category: "",
    status: "",
    featuredImage: null,
    allowComments: false,
    websites: [],
    metaTitle: "",
    metaDescription: "",
    focusKeywords: []
  });

  const [keyword, setKeyword] = useState("");
  
  const addKeyword = () => {
    if (keyword.trim()) {
      setData(prev => ({
        ...prev,
        focusKeywords: [...prev.focusKeywords, keyword.trim()]
      }));
      setKeyword("");
    }
  };

  const removeKeyword = (index) => {
    setData(prev => ({
      ...prev,
      focusKeywords: prev.focusKeywords.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && keyword.trim()) {
      e.preventDefault();
      addKeyword();
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setData(prev => ({
      ...prev,
      title: newTitle,
      slug: generateSlug(newTitle)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!data.title || !content || !data.category || !data.featuredImage || !data.metaTitle || !data.metaDescription || data.websites.length === 0 || !data.slug) {
        toast.error("Please fill all required fields.");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.title);
      formData.append("slug", data.slug);
      formData.append("content", content);
      formData.append("category", data.category);
      formData.append("status", data.status);
      formData.append("image", data.featuredImage);
      formData.append("comments", data.allowComments);
      formData.append("createdBy", userData._id);
      formData.append("metaTitle", data.metaTitle);
      formData.append("metaDescription", data.metaDescription);
      // Send websites as array directly
      data.websites.forEach((websiteId, index) => {
        formData.append(`websites[${index}]`, websiteId);
      });
      formData.append("focusKeywords", JSON.stringify(data.focusKeywords));

      const response = await axiosInstance.post("/api/blogs/createPost", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.status === 402) {
        toast.error("Blog with this title already exists!");
      } else {
        setData({
          title: "",
          slug: "",
          category: "",
          status: "",
          featuredImage: null,
          allowComments: false,
          websites: [],
          metaTitle: "",
          metaDescription: "",
          focusKeywords: []
        });
        setContent("");
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
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    onChange={handleTitleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="Type blog title"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="slug"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Slug * <span className="text-sm text-gray-500">(Auto-generated, but you can edit)</span>
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="your-blog-post-slug"
                    value={data.slug}
                    onChange={(e) => setData({ ...data, slug: generateSlug(e.target.value) })}
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
                <div className="space-y-4 md:space-y-6 col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Meta Title *
                    </label>
                    <input
                      type="text"
                      maxLength={60}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Enter meta title"
                      value={data.metaTitle}
                      onChange={(e) =>
                        setData({ ...data, metaTitle: e.target.value })
                      }
                    />
                    <small className="text-gray-500">{data.metaTitle.length}/60 characters</small>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Meta Description *
                    </label>
                    <textarea
                      maxLength={160}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Enter meta description"
                      value={data.metaDescription}
                      onChange={(e) =>
                        setData({ ...data, metaDescription: e.target.value })
                      }
                    />
                    <small className="text-gray-500">{data.metaDescription.length}/160 characters</small>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Websites *
                  </label>
                  <select
                    multiple
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={data.websites}
                    onChange={(e) =>
                      setData({
                        ...data,
                        websites: Array.from(e.target.selectedOptions, option => option.value)
                      })
                    }
                  >
                    {allWebsites.map((website) => (
                      <option key={website._id} value={website._id}>
                        {website.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Focus Keywords
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Enter a focus keyword and press Enter or Add"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="bg-blue-500 text-white rounded-lg px-4 whitespace-nowrap"
                    >
                      Add Keyword
                    </button>
                  </div>
                  
                  {data.focusKeywords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {data.focusKeywords.map((kw, index) => (
                        <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          <span>{kw}</span>
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
