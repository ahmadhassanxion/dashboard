import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/axios";
import DeleteBtn from "../../../Components/DeleteBtn";
import EditBtn from "../../../Components/EditBtn";
import moment from "moment"; // For date formatting
import hasPermission from "../../../helper/PermissionCheck";
const canEditBlog = hasPermission("blogs", "edit");
const canDeleteBlog = hasPermission("blogs", "delete");
// Define the columns for the DataGrid
const columns = [
  { field: "id", headerName: "ID", width: 90 },

  {
    field: "name",
    headerName: "Name",
    width: 250,
  },
  {
    field: "featuredImage",
    headerName: "Featured Image",
    width: 150,
    renderCell: (params) => (
      <div className="flex items-center justify-center w-[100px] h-[100%]">
        <img
          src={params.row.featuredImage}
          alt={params.row.name}
          className="w-[100%] h-[90%] rounded-[8px] object-cover "
        />
      </div>
    ),
  },
  {
    field: "createdBy",
    headerName: "Created By",
    width: 150,
    renderCell: (params) => (
      <div>{params.row.createdBy?.name || "Unknown"}</div>
    ),
  },
  {
    field: "views",
    headerName: "Views",
    width: 120,
  },
  {
    field: "comments",
    headerName: "Comments",
    width: 120,
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
  },
  {
    field: "uploadingDate",
    headerName: "Uploading Date",
    width: 200,
    renderCell: (params) =>
      moment(params.row.uploadingDate).format("MMMM Do YYYY, h:mm:ss a"),
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => (
      <div className="flex gap-2">
       {canDeleteBlog && <DeleteBtn id={params.row.id} route="blogs/deletePost" name="Post" />}
       {canEditBlog && <EditBtn id={params.row.id} route="singleBlog" />}
      </div>
    ),
  },
];

const BlogDataTable = () => {
  const [blogs, setBlogs] = useState([]);

  // Fetch the blogs data when the component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get("/api/blogs/allPosts");
        console.log(response);
        // Transform the data to match the DataGrid requirements
        const blogsWithId = response.data.map((blog) => ({
          ...blog,
          id: blog._id, // Map _id from MongoDB to id for DataGrid compatibility
          uploadingDate: blog.createdAt, // Use the correct field for uploading date
          comments: blog.comments?"Allowed":"Not Allowed"
        }));
        setBlogs(blogsWithId);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={blogs}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
    </Box>
  );
};

export default BlogDataTable;
