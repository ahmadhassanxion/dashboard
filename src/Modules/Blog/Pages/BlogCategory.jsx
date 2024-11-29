import AddBlogCategory from "../Components/AddBlogCategory";
import CategoryDataSection from "../Components/CategoryDataSection";


const BlogCategory = () => {
  return (
    <div>
     
      <div className="flex justify-between items-center p-4">
        <h1 className="text-4xl ">Blog Categories</h1>
        <AddBlogCategory />
    
      </div>
   <CategoryDataSection/>
    
    </div>
  );
}

export default BlogCategory