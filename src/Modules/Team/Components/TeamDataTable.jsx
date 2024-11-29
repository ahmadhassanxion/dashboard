import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/axios";
import DeleteBtn from "../../../Components/DeleteBtn";
import EditBtn from "../../../Components/EditBtn";
import { useSelector } from "react-redux";
import hasPermission from "../../../helper/PermissionCheck";
const canEditTeam = hasPermission("teams", "edit");
const canDeleteTeam = hasPermission("teams", "delete");
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
    field: "members",
    headerName: "Members",
    width: 160,
    renderCell: (params) => (
        <div className="flex gap-2">
        {params.name}
        {params.row.members.map((member , index) => (
            <>
          <img
          key={index}
          src={member.imageUrl}
          alt="profile"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
          </>
        ))}
      </div>
    ),
  },
  {
    field: "lead",
    headerName: "Team Lead",
    width: 160,
    renderCell: (params) => (
      <div className="flex gap-2">
        <img
          src={params.row.lead.imageUrl}
          alt="profile"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
        {params.row.lead.name}
      </div>
    ),
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => (
      <div className="flex gap-2">
       {canDeleteTeam && <DeleteBtn
          id={params.row.id}
          route="teams/deleteTeam"
          name={params.row.name}
        />}
       {canEditTeam && <EditBtn id={params.row.id} route="singleTeam" />}
      </div>
    ),
  },
];

const TeamDataTable = () => {
  const [users, setUsers] = useState([]);
   const GlobalRender = useSelector((state) => state.GlobalSlice);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/teams/allTeams");
        const usersWithId = response.data.map((user) => ({
          ...user,
          id: user._id,
          image: user.imageUrl,
        }));
        setUsers(usersWithId);
        console.log(usersWithId);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, [ GlobalRender]);

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

export default TeamDataTable;
