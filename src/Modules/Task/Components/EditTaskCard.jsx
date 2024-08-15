import  { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTask } from "../SingleTaskSlice";
import axiosInstance from "../../../Utils/axios";
import toast from "react-hot-toast";

const EditTaskCard = () => {
  const task = useSelector((state) => state.SingleTaskSlice);
  const dispatch =useDispatch();
  const [allTeams, setAllTeams] = useState([]);
  const [data, setData] = useState({
    name: "",
    image: null,
    description: "",
    team: "",
    priority: "Low",
    status: "Pending",
    endDate: "",
  });

  useEffect(() => {
    setData({
      name: task.name || "",
      image: task.file || null,
      description: task.description || "",
      team: task.team || "",
      priority: task.priority || "Low",
      status: task.status || "Pending",
      endDate: formatDateForInput(task.endDate) || "",
    });
  }, [task]);

  useEffect(() => {
    const getAllTeams = async () => {
      try {
        const response = await axiosInstance.get("/api/teams/allTeams");
        setAllTeams(response.data);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };
    getAllTeams();
  }, []);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await axiosInstance.put(`/api/tasks/updateTask/${task._id}` , data);
        console.log(response);
        dispatch(updateTask(response.data));
        toast.success("Task updated successfully");

    }catch(err){
        toast.error("Error updating task ");
        console.error(err);
    }
  };

  return (
    <div className="relative px-4 w-full max-w-md max-h-full">
      <div className="relative h-full bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900">Update Task</h3>
        </div>

        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={(e) => setData({ ...data, name: e.target.value })}
                value={data.name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Type task name"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Task Description
              </label>
              <textarea
                name="description"
                id="description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 h-[100px]"
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                value={data.description}
                required
                placeholder="Type task description"
              ></textarea>
            </div>
          </div>

          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="team"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Team
              </label>
              <select
                id="team"
                name="team"
                value={data.team._id}
                onChange={(e) => setData({ ...data, team: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              >
                <option value="">Choose Team</option>
                {allTeams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="priority"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={data.priority}
                onChange={(e) => setData({ ...data, priority: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="endDate"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                End Date
              </label>
              <input
                type="datetime-local"
                name="endDate"
                id="endDate"
                value={data.endDate}
                onChange={(e) => setData({ ...data, endDate: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskCard;
