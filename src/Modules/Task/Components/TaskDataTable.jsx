import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import moment from "moment"; // Import moment.js
import axiosInstance from "../../../Utils/axios";
import DeleteBtn from "../../../Components/DeleteBtn";
import EditBtn from "../../../Components/EditBtn";
import { FcFolder } from "react-icons/fc";

const columns = [
  { field: "id", headerName: "ID", width: 90 },

  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "team",
    headerName: "Team",
    width: 160,
    renderCell: (params) => (
      <div className="flex gap-2">
        <img
          src={params.row.team.imageUrl}
          alt="profile"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
        {params.row.team.name}
      </div>
    ),
  },

  {
    field: "status",
    headerName: "Status",
    width: 150,
  },
  {
    field: "timeLeft",
    headerName: "Time Left",
    width: 200,
    renderCell: (params) => {
      const endDate = moment(params.row.endDate);
      const now = moment();

      if (now.isBefore(endDate)) {
        const duration = moment.duration(endDate.diff(now));
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();
        return (
          <div>
            {days > 0 && `${days}d `}
            {hours > 0 && `${hours}h `}
            {minutes > 0 && `${minutes}m`}
          </div>
        );
      } else {
        return (
          <div>
            <div>Ended {endDate.fromNow()}</div>
            <div>({endDate.format("MMMM Do YYYY, h:mm:ss a")})</div>
          </div>
        );
      }
    },
  },
  {
    field: "endDate",
    headerName: "End Date",
    width: 150,
  },

  {
    field: "image",
    headerName: "Task Resource",
    width: 150,
    renderCell: (params) => (
      <div className="flex items-center justify-center h-full">
        <a href={params.row.image} download target="_blank">
          <FcFolder className="text-3xl" />
        </a>
      </div>
    ),
  },
  {
    field: "action",
    headerName: "Action",
    width: 160,
    renderCell: (params) => (
      <div className="flex gap-2">
        <DeleteBtn
          id={params.row.id}
          route="tasks/deleteTask"
          name={params.row.name}
        />
        <EditBtn id={params.row.id} route="singleTask" />
      </div>
    ),
  },
];

const TaskDataTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/tasks/allTasks");

        const usersWithId = response.data.map((user) => ({
          ...user,
          id: user._id,
          image: user.file,
        }));
        setUsers(usersWithId);
        // console.log(usersWithId);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

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

export default TaskDataTable;
