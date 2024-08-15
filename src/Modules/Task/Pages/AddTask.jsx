import { useState, useEffect } from "react";
import axiosInstance from "../../../Utils/axios";
import toast from "react-hot-toast";

const AddTask = () => {
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState({
    name: "",
    image: null,
    description: "",
    team: "",
    priority: "Low", // Add priority default value
    status: "Pending", // Add status default value
    endDate: "", // End date
  });
  const [availableTeams, setAvailableTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axiosInstance.get("/api/teams/allTeams");
        setAvailableTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!data.name || !data.description || !data.team || !data.endDate) {
        toast.error("Please fill all fields");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("image", data.image);
      formData.append("description", data.description);
      formData.append("team", data.team);
      formData.append("priority", data.priority);
      formData.append("status", data.status);
      formData.append("endDate", data.endDate);

      const response = await axiosInstance.post(
        "/api/tasks/createTask",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 201) {
        toast.error("Error Creating Task!");
      } else {
        setData({
          name: "",
          image: null,
          description: "",
          team: "",
          priority: "Low", // Reset priority
          status: "Pending", // Reset status
          endDate: "", // Reset end date
        });
        toast.success("Task Created Successfully!");
        setToggle(!toggle);
      }
    } catch (err) {
      toast.error("Error While Creating Task!");
      console.log(err);
    }
  };

  return (
    <div>
      <button
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        type="button"
        onClick={() => setToggle(!toggle)}
      >
        Add Task
      </button>

      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden="true"
        className={`${
          toggle ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full bg-[rgba(0,0,0,0.4)]`}
      >
        <div className="relative p-4 w-full max-w-4xl max-h-full">
          <div className="relative bg-white rounded-lg shadow flex">
            <div className="flex-1 p-4 md:p-5">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Create New Task
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setToggle(!toggle)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Task Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={data.name}
                      onChange={(e) =>
                        setData({ ...data, name: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Type task name"
                      required
                    />
                  </div>
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
                  <div className="col-span-2">
                    <label
                      htmlFor="image"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Task Resource File
                    </label>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      onChange={(e) =>
                        setData({ ...data, image: e.target.files[0] })
                      }
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="team"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Choose Team
                    </label>
                    <select
                      id="team"
                      name="team"
                      value={data.team}
                      onChange={(e) =>
                        setData({ ...data, team: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      required
                    >
                      <option value="">Select Team</option>
                      {availableTeams.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

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
                      onChange={(e) =>
                        setData({ ...data, priority: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

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
                      onChange={(e) =>
                        setData({ ...data, status: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

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
                      onChange={(e) =>
                        setData({ ...data, endDate: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Create Task
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
