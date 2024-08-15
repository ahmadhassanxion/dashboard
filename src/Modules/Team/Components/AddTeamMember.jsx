import { useEffect, useState } from "react";
import axiosInstance from "../../../Utils/axios";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { BiPlus } from "react-icons/bi";
import { addMember } from "../SingleTeamSlice";

const AddTeamMember = () => {
  const [toggle, setToggle] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const team = useSelector((state) => state.SingleTeamSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const fetchUsers = async () => {
        const response = await axiosInstance.get("/api/users/allUsers");
        setSelectedUsers(response.data);
      };

      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  }, []);

  // Filter out users who are already members of the team
  const availableUsers = selectedUsers.filter(
    (member) => !team.members?.some((user) => user._id === member._id)
  );

  return (
    <div>
      <button
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
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
        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <span className="absolute top-0 right-0 p-3 cursor-pointer z-10 rounded-[50%] shadow-lg bg-white" onClick={() => setToggle(!toggle)}>
          <RxCross1 />
        </span>
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex flex-col justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 lg:text-2xl ">
                Add Team Member
              </h3>

              <div className="flex flex-col gap-3 w-full">
                {availableUsers.length > 0 ? (
                  availableUsers.map((member) => (
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

                        <div>
                          <BiPlus onClick={() => dispatch(addMember(member))}/>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No Users available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeamMember;
