import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axios";
import { setPost } from "../SinglePostSlice";
import BlogEditForm from "../Components/BlogEditForm";
import PostDataCard from "../Components/BlogDataCard";

const SingleBlog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axiosInstance.get(`/api/blogs/post/${id}`);
        dispatch(setPost(response.data));
      } catch (error) {
        console.error("Error fetching post:", error.message);
      }
    };
    getPost();
  }, [id, dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:sticky lg:top-8 h-fit">
          <PostDataCard />
        </div>
        <div className="min-h-[calc(100vh-4rem)]">
          <BlogEditForm />
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;