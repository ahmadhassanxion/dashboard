import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../Utils/axios";
import { setPost } from "../SinglePostSlice";
import toast from "react-hot-toast";

const PostDataCard = () => {
    const post = useSelector((state) => state.SinglePostSlice) || {};
    const [userImage, setUserImage] = useState(null);
    const dispatch = useDispatch();

    const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
          const response = await axiosInstance.put(
            `/api/blogs/updatePostImage/${post._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          dispatch(setPost(response.data));
          setUserImage(response.data.featuredImage);
          toast.success("Featured image updated successfully!");
        } catch (error) {
          console.error("Error uploading the image:", error);
          toast.error("Failed to update featured image");
        }
      }
    };

  if (!post._id) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow p-5 mb-5">
        <p className="text-center text-gray-500">No post selected</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow p-5 mb-5">
      {/* Featured Image */}
      <div className="overflow-hidden max-h-[300px] mb-4">
        <img
          className="w-full rounded shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
          alt="Featured"
          src={post.featuredImage || '/placeholder-image.jpg'}
          onClick={() => document.getElementById("image").click()}
        />
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Post Information */}
      <div className="pb-5">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.name}</h2>

        <div className="flex flex-wrap items-center mb-3 gap-4">
          {/* Author Information */}
          {post.createdBy && (
            <div className="flex items-center">
              {post.createdBy.imageUrl && (
                <img
                  src={post.createdBy.imageUrl}
                  alt={post.createdBy.name}
                  className="h-8 w-8 rounded-full mr-2"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {post.createdBy.name}
                </p>
              </div>
            </div>
          )}

          {/* Category */}
          {post.category && (
            <div className="flex items-center">
              {post.category.icon && (
                <img
                  src={post.category.icon}
                  alt={post.category.name}
                  className="h-6 w-6 mr-2"
                />
              )}
              <span className="text-sm text-gray-600">{post.category.name}</span>
            </div>
          )}

          {/* Other Details */}
          <div className="text-sm text-gray-500 flex gap-4 items-center">
            <p>
              <b>Views:</b> {post.views || 0}
            </p>
            <p>
              <b>Status:</b> {post.status || 'draft'}
            </p>
          </div>
        </div>

        {/* SEO Information */}
        {(post.metaTitle || post.metaDescription || post.focusKeywords?.length > 0) && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">SEO Information</h3>
            {post.metaTitle && (
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Meta Title:</span> {post.metaTitle}
              </p>
            )}
            {post.metaDescription && (
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Meta Description:</span> {post.metaDescription}
              </p>
            )}
            {post.focusKeywords?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.focusKeywords.map((keyword, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDataCard;
