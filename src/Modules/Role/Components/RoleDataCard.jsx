// import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// import TeamLeadLogo from "../../../assets/team-leader.png";
import axiosInstance from "../../../Utils/axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import { Link } from "react-router-dom";

const RoleDataCard = () => {
  const role = useSelector((state) => state.SingleRoleSlice);
  const {id} = useParams();
  const [assignedUsers , setAssignedUsers] = useState();
  console.log(role);

  useEffect(()=>{
    try{
      const fetchUsersByRole = async()=>{
        const response = await axiosInstance.get(`/api/roles/allUsersWithRole/${id}`);
        console.log(response);
        setAssignedUsers(response.data)
      }
     fetchUsersByRole();

    }catch(err){
      console.error(err);
    }
  },[])
 


  

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow p-[20px]">
      <div className="flex flex-col items-center pb-10">
        <div className="overflow-hidden w-full max-h-[300px] flex gap-8 justify-center items-center rounded-md shadow-lg border-gray-100 mb-3">
          <div className="flex-[8] p-2">
            <h2 className="text-2xl font-semibold">{role.name}</h2>
            <h2 className="">{role.description}</h2>
          </div>
        </div>

        <div
          className="shadow-lg w-full p-4 bg-white rounded-lg md:p-8"
          id="stats"
          role="tabpanel"
          aria-labelledby="stats-tab"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2  ">
            {assignedUsers?.map((assignedUser, index) => (
              // Check if the member is not the lead

              <div
                key={index}
                className="flex flex-col justify-start items-start p-2 gap-2 shadow-lg"
              >
                <Link
                  to={`/singleUser/${assignedUser._id}`}
                  className="flex flex-col justify-start items-start p-2 gap-2 w-full"
                >
                  <img
                    src={assignedUser.imageUrl}
                    alt={assignedUser.name}
                    className="max-h-[130px] min-h-[130px] w-full object-cover object-top rounded-md"
                  />
                  <h3 className="truncate w-full">
                    <span className="font-semibold">Name: </span>
                    {assignedUser.name}
                  </h3>
                  <p className="truncate w-full ">
                    <span className="font-semibold">Email: </span>

                    {assignedUser.email}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDataCard;
