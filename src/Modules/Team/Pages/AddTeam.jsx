import { useState, useEffect } from "react";
import axiosInstance from "../../../Utils/axios";
import toast from "react-hot-toast";
import Sidebar from "../Components/SideBar"; // Ensure the import path is correct
import { useDispatch } from "react-redux";
import { updateGlobal } from "../../Global/GlobalSlice";


const AddTeam = () => {
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();
  const [data, setData] = useState({
    name: "",
    image: null,
    members: [], // Array to hold team member IDs
    lead: "", // ID of the selected team lead
  });
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/users/allUsers");
        setAvailableUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!data.name || !data.members.length || !data.lead) {
        toast.error("Please fill all fields");
        return;
      }
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("image", data.image);
      data.members.forEach((member , index)=>{
        formData.append("members["+index+"]",(member._id));
      })
      formData.append("lead", data.lead);
console.log(data);
      const response = await axiosInstance.post(
        "/api/teams/createTeam",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 402) {
        toast.error("Error Creating Team!");
      } else {
        setData({ name: "", image: null, members: [], lead: "" });
        toast.success("Team Created Successfully!");
         dispatch(updateGlobal());
        setToggle(!toggle);
      }
    } catch (err) {
      toast.error("Error While Creating Team!");
      console.log(err);
    }
  };

  // Function to handle member addition from available users
  const handleAddMember = (user) => {
    if (!data.members.find((member) => member._id === user._id)) {
      setData({ ...data, members: [...data.members, user] });
    }
  };

  // Function to handle member removal
  const handleRemoveMember = (userId) => {
    setData({
      ...data,
      members: data.members.filter((user) => user._id !== userId),
    });
  };

  return (
    <div>
      <button
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        type="button"
        onClick={() => setToggle(!toggle)}
      >
        Add Team
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
            <Sidebar onAddMember={handleAddMember} users={availableUsers} />

            <div className="flex-1 p-4 md:p-5">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 className="text-lg font-semibold text-gray-900 ">
                  Create New Team
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
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
                      Team Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={data.name}
                      onChange={(e) =>
                        setData({ ...data, name: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                      placeholder="Type team name"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="image"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Team Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      onChange={(e) =>
                        setData({ ...data, image: e.target.files[0] })
                      }
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 "
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="members"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Team Members
                    </label>
                    <div className="border border-gray-300 rounded-lg p-2 h-32 overflow-y-auto">
                      {/* List of selected members */}
                      {data.members.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center justify-between py-2 px-3 border-b"
                        >
                          <span>{member.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member._id)}
                            className="text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="lead"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Team Lead
                    </label>
                    <select
                      id="lead"
                      name="lead"
                      value={data.lead}
                      onChange={(e) =>
                        setData({ ...data, lead: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                      required
                    >
                      <option value="">Select Lead</option>
                      {data.members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Create Team
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeam;
