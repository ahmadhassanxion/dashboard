// import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// import TeamLeadLogo from "../../../assets/team-leader.png";
// import axiosInstance from "../../../Utils/axios";
// import { Link } from "react-router-dom";

const RoleDataCard = () => {
  const role = useSelector((state) => state.SingleRoleSlice);
 


  

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow p-[20px]">
      <div className="flex flex-col items-center pb-10">
        <div className="overflow-hidden w-full max-h-[300px] flex gap-8 justify-center items-center rounded-md shadow-lg border-gray-100 mb-3">
         
          <div className="flex-[8] p-2">
            <h2 className="text-2xl font-semibold">{role.name}</h2>
            <h2 className="">{role.description}</h2>
           
          </div>
        </div>

        {/* <div
          className="shadow-lg w-full p-4 bg-white rounded-lg md:p-8"
          id="stats"
          role="tabpanel"
          aria-labelledby="stats-tab"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2  ">
            <div className="flex flex-col justify-start items-start p-2 gap-2 shadow-lg">
              <Link
                to={`/singleUser/${team.lead._id}`}
                className="flex flex-col justify-start items-start p-2 gap-2"
              >
                <img
                  src={team.lead.imageUrl}
                  alt={team.lead.name}
                  className="max-h-[130px] w-full object-cover object-center rounded-md"
                />
                <h3>
                  <span className="font-semibold">Position: </span>
                  Team Lead
                </h3>
                <h3>
                  <span className="font-semibold">Name: </span>
                  {team.lead.name}
                </h3>
                <p>
                  <span className="font-semibold">Email: </span>
                  {team.lead.email}
                </p>
                <p>
                  <span className="font-semibold">Role: </span>
                  {team.lead.role}
                </p>
              </Link>
            </div>
            {team.members.map(
              (member, index) =>
                // Check if the member is not the lead
                member._id !== team.lead._id && (
                  <div
                    key={index}
                    className="flex flex-col justify-start items-start p-2 gap-2 shadow-lg"
                  >
                    <Link
                      to={`/singleUser/${member._id}`}
                      className="flex flex-col justify-start items-start p-2 gap-2 w-full"
                    >
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="max-h-[130px] w-full object-cover object-center rounded-md"
                      />
                      <h3>
                        {" "}
                        <span className="font-semibold">Name: </span>
                        {member.name}
                      </h3>
                      <p>
                        {" "}
                        <span className="font-semibold">Email: </span>
                        {member.email}
                      </p>
                      <p>
                        {" "}
                        <span className="font-semibold">Role: </span>
                        {member.role}
                      </p>
                    </Link>
                  </div>
                )
            )}
          </div>
        </div> */}

        
      </div>
    </div>
  );
};

export default RoleDataCard;
