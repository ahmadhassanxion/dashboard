import hasPermission from "../../helper/PermissionCheck";
import BlogDataSection from "./Components/BlogDataSection";
import AddBlog from "./Pages/AddBlog";

const Blog = () => {
 const canAddBlog = hasPermission("blogs", "create");

  return (
     <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-4xl ">Blogs</h1>
       {canAddBlog&& <AddBlog />}
      </div>
      <BlogDataSection/>
    </div>
    
  );
};


export default Blog;


