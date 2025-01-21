import React from 'react'
import AddBlogWebsite from '../Components/AddBlogWebsite'
import WebsiteDataSection from '../Components/WebsiteDataSection'

const BlogWebsite = () => {
  return (
    <div>
     
    <div className="flex justify-between items-center p-4">
      <h1 className="text-4xl ">Blog Websites</h1>
      <AddBlogWebsite />
  
    </div>
 <WebsiteDataSection/>
  
  </div>
  )
}

export default BlogWebsite