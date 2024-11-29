import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../Utils/axios";
import { updateFeaturedImage } from "../SinglePostSlice";


const PostDataCard = () => {
    const post = useSelector((state) => state.SinglePostSlice);
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
            `/api/blogs/updatePostImage/${post._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log(response);
          // Assuming the response contains the new image URL
          const newImageUrl = response.data.featuredImage;

          // Update the image in the Redux store
          dispatch(updateFeaturedImage(newImageUrl));

          // Update the local state
          setUserImage(newImageUrl);
        } catch (error) {
          console.error("Error uploading the image:", error);
        }
      }
    };
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow p-5 mb-5">
      {/* Featured Image */}
      <div className="overflow-hidden max-h-[300px] mb-4">
        <img
          className="w-full rounded shadow-lg"
          alt="Featured"
          src={post.featuredImage}
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

      {/* Post Information */}
      <div className="pb-5">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.name}</h2>

        <div className="flex items-center mb-3 gap-4">
          {/* Author Information */}
          <div className="flex items-center mb-3">
            <img
              src={post.createdBy.imageUrl}
              alt={post.createdBy.name}
              className="h-8 w-8 rounded-full mr-2"
            />
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {post.createdBy.name}
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center mb-3">
            <img
              src={post.category.icon}
              alt={post.category.name}
              className="h-6 w-6 mr-2"
            />
            <span className="text-sm text-gray-600">{post.category.name}</span>
          </div>
          {/* Other Details */}
          <div className="text-sm text-gray-500 flex gap-4 items-center justify-center mb-3">
            <p>
              <b>Views:</b> {post.views}
            </p>
            <p>
              <b>Status:</b> {post.status}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <div
          className="text-gray-700 text-base mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </div>
    </div>
  );
};

export default PostDataCard;
