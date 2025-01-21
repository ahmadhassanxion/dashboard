import  { useState, useEffect } from "react";
import axiosInstance from "../../../Utils/axios";
import toast from "react-hot-toast";
import DeleteBtn from "../../../Components/DeleteBtn";
import { FaPencilAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
const WebsiteDataSection = () => {
  const [websites, setWebsites] = useState([]);
  const [editData, setEditData] = useState({ name: "", icon: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);
  const GlobalSlice = useSelector(state=>state.GlobalSlice);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await axiosInstance.get("/api/blogs/allWebsites");
        setWebsites(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching websites");
      }
    };

    fetchWebsites();
  }, [GlobalSlice]);

  const handleEditClick = (website) => {
    setSelectedWebsiteId(website._id);
    setEditData({ name: website.name, link: website.link });
    setIsEditModalOpen(true);
  };



  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("link", editData.link);

     const response= await axiosInstance.put(
        `/api/blogs/editWebsite/${selectedWebsiteId}`,
        formData       
      );

console.log(response);
      setWebsites(
        websites.map((website) =>
          website._id === selectedWebsiteId
            ? { ...website, name:response.data.name,link:response.data.link}
            : website
        )
      );

      toast.success("Website updated successfully");
      setIsEditModalOpen(false);
      setEditData({ name: "", link: "" });
    } catch (err) {
      console.error(err);
      toast.error("Error updating website");
    }
  };

  return (
    <div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {websites.map((website) => (
          <div
            key={website._id}
            className="border rounded-lg p-4 bg-white shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
               
                <h4 className="text-lg font-medium">{website.name}</h4>
                <p className="text-sm text-gray-500">
                  Link: {website.link}
                </p>
                <p className="text-sm text-gray-500">
                  Created by: {website.createdBy.name}
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleEditClick(website)}
                  className="mt-[7px] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm py-[10px] px-[12px] mb-2 "
                >
                  <FaPencilAlt />
                </button>

                <DeleteBtn
                  id={website._id}
                  route={"blogs/websites"}
                  name="Website"
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
            <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Website
            </h3>
            <span onClick={() => setIsEditModalOpen(false)} className="cursor-pointer">x</span>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website Name
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
                  htmlFor="link"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website Link
                </label>
                <input
                  type="text"
                  id="link"
                  value={editData.link}
                  onChange={(e) =>
                    setEditData({ ...editData, link: e.target.value })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
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

export default WebsiteDataSection;
