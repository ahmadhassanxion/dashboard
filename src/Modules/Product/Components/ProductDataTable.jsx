import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/axios";
import DeleteBtn from "../../../Components/DeleteBtn";
import EditBtn from "../../../Components/EditBtn";
import { useSelector } from "react-redux";
import hasPermission from "../../../helper/PermissionCheck";
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
        console.log(response.data);
        // Map through the response data to format it for the DataGrid
        const productsWithId = response.data.map((product) => ({
          ...product,
          id: product._id,
          createdBy: product.createdBy.name,
          items: product.items?.slice(0, 6).map((item) => item.file), // Keep items as an array of file URLs
        }));

        setProducts(productsWithId); // Set the formatted data to state
        console.log(productsWithId); // For debugging, log the formatted data
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
