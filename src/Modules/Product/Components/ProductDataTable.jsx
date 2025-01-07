import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/axios";
import DeleteBtn from "../../../Components/DeleteBtn";
import EditBtn from "../../../Components/EditBtn";
import { useSelector } from "react-redux";
import hasPermission from "../../../helper/PermissionCheck";
import { render } from "timeago.js";
const canEditProduct = hasPermission("products", "edit");
const canDeleteProduct = hasPermission("products", "delete");

// Define the columns of the DataGrid
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "tone",
    headerName: "Tone",
    width: 150,
  },
  {
    field: "type",
    headerName: "Type",
    width: 150,
  },
  {
    field: "category",
    headerName: "Category",
    width: 150,
  },
  {
    field: "price",
    headerName: "Price",
    width: 150,
    renderCell: (params) => (
      <div className="flex items-center gap-2">
        <span>${params.value}</span>
      </div>
    ),

  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
  },
  {
    field: "published",
    headerName: "Published",
    width: 120,
    type: 'boolean',
  },
  {
    field: "createdBy",
    headerName: "CreatedBy",
    width: 150,
  },
  {
    field: "items",
    headerName: "Items",
    width: 300,
    renderCell: (params) => (
      <div style={{ display: "flex", gap: "5px" }}>
        {/* Render up to 6 images from the items array */}
        {params?.value.slice(0, 6).map((url, index) => (
          <img
            key={index}
            src={url}
            alt="item"
            className="w-[40px] h-[40px] rounded-[50%] object-contain shadow-xl  p-1"
            
          />
        ))}
      </div>
    ),
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => (
      <div className="flex gap-2">
        {canDeleteProduct && <DeleteBtn
          id={params.row.id}
          route="products/deleteProduct"
          name={params.row.name}
        />}
       {canEditProduct && <EditBtn id={params.row.id} route="singleProduct" />}
      </div>
    ),
  },
];

// Function to calculate row height based on the number of items (images)


const UserDataTable = () => {
  const [products, setProducts] = useState([]);
  const GlobalRender = useSelector((state) => state.GlobalSlice);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/products/allProducts");
        console.log("Raw response data:", response.data);
        // Map through the response data to format it for the DataGrid
        const productsWithId = response.data.map((product) => {
          console.log("Individual product:", product);
          return {
            id: product._id,
            name: product.name,
            description: product.description,
            type: product.type,
            tone: product.tone,
            category: product.category,
            price: product.price,
            status: product.status,
            published: product.published,
            createdBy: product.createdBy.name,
            items: product.items?.slice(0, 6).map((item) => item.file),
          };
        });

        setProducts(productsWithId);
        console.log("Formatted products:", productsWithId);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts(); // Call the fetch function
  }, [GlobalRender]); // Dependency array to re-run on GlobalRender change

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={products}
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

export default UserDataTable;
