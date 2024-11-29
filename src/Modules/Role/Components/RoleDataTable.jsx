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
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "description",
    headerName: "Description",
    width: 150,
  },
  {
    field: "permissions",
    headerName: "Permissions",
    width: 300,
    renderCell: (params) => {
      const permissions = params.row.permissions
        .map(
          (perm) =>
            `
          ${perm.resource}
       
           : ${perm.actions
              .map((action) => action.charAt(0).toUpperCase())
              .join(", ")}`
        )
        .join(" | ");
      return <span className="capitalize">{permissions}</span>;
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => (
      <div className="flex gap-2" key={params.id}>
        <DeleteBtn
          id={params.row.id}
          route="roles/deleteRole"
          name={params.row.name}
        />
        <EditBtn id={params.row.id} route="singleRole" />
      </div>
    ),
  },
];

const RoleDataTable = () => {
  const [users, setUsers] = useState([]);
   const GlobalRender = useSelector((state) => state.GlobalSlice);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/api/roles/allRoles");
        const usersWithId = response.data.map((user) => ({
          ...user,
          id: user._id,
        }));
        setUsers(usersWithId);
        console.log(usersWithId);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRoles();
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

export default RoleDataTable;
