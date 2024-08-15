import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/axios";
import DeleteBtn from "../../../Components/DeleteBtn";
import EditBtn from "../../../Components/EditBtn";
import { useSelector } from "react-redux";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "image",
    headerName: "Profile Image",
    width: 90,
    renderCell: (params) => (
      <img
        src={params.value}
        alt="profile"
        style={{ width: 40, height: 40, borderRadius: "50%" }}
      />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "email",
    headerName: "Email",
    width: 160,
  },
  {
    field: "role",
    headerName: "Role",
    width: 160,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 160,
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => (
      <div className="flex gap-2">
      <DeleteBtn id={params.row.id} route="users/deleteUser" name={params.row.name}/>
      <EditBtn id={params.row.id} route="singleUser"/>
      </div>
    ),
  },
];

const UserDataTable = () => {
  const [users, setUsers] = useState([]);
  const GlobalRender = useSelector((state) => state.GlobalSlice);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/users/allUsers");
        const usersWithId = response.data.map((user) => ({
          ...user,
          id: user._id,
          image: user.imageUrl,
          role: user.role.name,
        }));
        setUsers(usersWithId);
        console.log(usersWithId);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, [GlobalRender]);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={users}
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
