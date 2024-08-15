import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../Utils/axios";
import { updateTeam } from "../SingleTeamSlice";
import toast from "react-hot-toast"; // If you're using toast notifications
import { RxCross1 } from "react-icons/rx";
import AddTeamMember from "./AddTeamMember";

const UserEditForm = () => {
  const team = useSelector((state) => state.SingleTeamSlice);
  const dispatch = useDispatch();

  const [data, setData] = useState({
    name: "",
    members: [],
    lead: "",
  });

  useEffect(() => {
    setData({
      name: team.name || "",
      members: team.members || [],
      lead: team.lead || "",
    });
  }, [team]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/api/teams/updateTeam/${team._id}`,
        data
      );

      dispatch(updateTeam(response.data));
      toast.success("Team updated successfully!");
      console.log(response);
    } catch (err) {
      toast.error("Error updating team!");
      console.log(err);
    }
  };

  const handleRemoveMember = (memberId) => {
    const updatedMembers = data.members.filter(
      (member) => member._id !== memberId
    );

    setData((prevState) => ({
      ...prevState,
      members: updatedMembers,
    }));
  };

  return (
    <div className="relative px-4 w-full max-w-md max-h-full">
      <div className="relative h-full bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900">Update Team</h3>
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
                placeholder="Type team name"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="lead"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Team Lead
              </label>
              <select
                value={data.lead._id}
                onChange={(e) => setData({ ...data, lead: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              >
                <option value="">Choose Team Lead</option>
                {team.members?.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="members"
                className="flex items-center justify-between mb-2 text-sm font-medium text-gray-900"
              >
                Team Members
                <AddTeamMember />
              </label>
              <div className="flex flex-col gap-3">
                {data.members?.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center mb-2 shadow-md p-2 border-gray-100"
                  >
                    <div className="flex gap-2 items-center justify-between w-full">
                      <div className="flex gap-3 items-center justify-center">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={member.imageUrl}
                          alt={member.name}
                        />
                        <div className="flex flex-col gap-1">
                          <p>{member.name}</p>
                          <p>{member.role.name}</p>
                        </div>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => handleRemoveMember(member._id)}
                      >
                        <RxCross1 />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

export default UserEditForm;
