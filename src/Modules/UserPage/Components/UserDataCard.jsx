import  { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserImage } from "../SingleUserSlice"; 
import axiosInstance from "../../../Utils/axios";

const UserDataCard = () => {
  const user = useSelector((state) => state.SingleUserSlice);
  const [userImage, setUserImage] = useState(null);
  const dispatch = useDispatch();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        // Sending the API request to update the image
        const response = await axiosInstance.put(
          `/api/users/updateUserImage/${user._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

         console.log(response);
        // Assuming the response contains the new image URL
        const newImageUrl = response.data.imageUrl;

        // Update the image in the Redux store
        dispatch(updateUserImage(newImageUrl));

        // Update the local state
        setUserImage(newImageUrl);
      } catch (error) {
        console.error("Error uploading the image:", error);
      }
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow p-[20px]">
      <div className="flex flex-col items-center pb-10">
        <div className="overflow-hidden max-h-[300px]">
          <img
            className="w-full mb-3 rounded shadow-lg border-gray-100 "
            alt="User image"
            src={userImage || user.imageUrl}
            onClick={() => document.getElementById("image").click()}
          />
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div
          className="shadow-lg w-full p-4 bg-white rounded-lg md:p-8"
          id="stats"
          role="tabpanel"
          aria-labelledby="stats-tab"
        >
          <dl className="grid max-w-screen-xl grid-cols-1 gap-8 mx-auto text-gray-900 sm:grid-cols-2 xl:grid-cols-2">
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-2xl font-bold">Name</dt>
              <dd className="text-gray-500">{user.name}</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-2xl font-bold">Email</dt>
              <dd className="text-gray-500">{user.email}</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-2xl font-bold">Phone No.</dt>
              <dd className="text-gray-500">{user.phone}</dd>
            </div>
            <div className="flex flex-col items-center justify-center">
              <dt className="mb-2 text-2xl font-bold">Role</dt>
              <dd className="text-gray-500">{user.role.name}</dd>
            </div>
          </dl>
        </div>

        <div className="flex mt-4 md:mt-6">
          <button
            type="button"
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDataCard;
