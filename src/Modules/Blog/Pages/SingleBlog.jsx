import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../Utils/axios";
import { updatePost } from "../SinglePostSlice";
import BlogEditForm from "../Components/BlogEditForm";
import PostDataCard from "../Components/BlogDataCard";

const SingleBlog = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
      const getUser = async () => {
        try {
          const response = await axiosInstance.get(
            `/api/blogs/post/${id}`
          );
          console.log(response);
          dispatch(updatePost(response.data));
        } catch (e) {
          console.error(e.message);
        }
      };
      getUser();
    }, [id, dispatch]);
  return (
    <div className="flex flex-col gap-[10px]">
      <div className={`grid grid-cols-1 gap-4 md:grid-cols-2`}>
        <PostDataCard />
        <BlogEditForm />
      </div>
     
    </div>
  );
}

export default SingleBlog