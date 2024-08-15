// import { useState } from "react";
import { useSelector } from "react-redux";
// import { updateTeamImage } from "../SingleTeamSlice";
// import TeamLeadLogo from "../../../assets/team-leader.png";
// import axiosInstance from "../../../Utils/axios";
import { Link } from "react-router-dom";
import moment from "moment";

const TaskDataCard = () => {
  const task = useSelector((state) => state.SingleTaskSlice);
 

  function xenoDate(xeno){
const endDate = moment(xeno);
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
}

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow p-[20px]">
      <div className="flex flex-col items-center pb-2">
        <div className="overflow-hidden w-full max-h-[300px] flex gap-8 justify-center items-center rounded-md shadow-lg border-gray-100 mb-3">
          <div className="flex-[8] p-3">
            <h2 className="text-3xl font-semibold mb-2">{task.name}</h2>
            <ul className="flex justify-start items-center gap-2">
              <li className="text-[20px]  flex-1 flex gap-3 ">
                <span className="font-semibold"> Priority:</span>
                <div>{task.priority}</div>
              </li>
              <li className="text-[20px] flex-1 flex gap-3 ">
                <span className="font-semibold">End Time:</span>
                {xenoDate(task.endDate)}
              </li>
              <li className="text-[20px]  flex-1 flex gap-3 ">
                <span className="font-semibold">Status:</span>
                <div>{task.status}</div>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="shadow-lg w-full p-4 bg-white rounded-lg md:p-8"
          id="stats"
          role="tabpanel"
          aria-labelledby="stats-tab"
        >
          <h1 className="text-3xl font-semibold mb-3 text-center">Assigned to Team {task.team.name}</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2  ">
            <div className="flex flex-col justify-start items-start p-2 gap-2 shadow-lg">
              <Link
                to={`/singleUser/${task?.team.lead?._id}`}
                className="flex flex-col justify-start items-start p-2 gap-2 w-full"
              >
                <img
                  src={task?.team.lead?.imageUrl}
                  alt={task?.team.lead?.name}
                  className="max-h-[130px] w-full object-cover object-center rounded-md"
                />
                <h3>
                  <span className="font-semibold">Position: </span>
                  Team Lead
                </h3>
                <h3>
                  <span className="font-semibold">Name: </span>
                  {task?.team.lead?.name}
                </h3>
                <p>
                  <span className="font-semibold">Email: </span>
                  {task?.team.lead?.email}
                </p>
                <p>
                  <span className="font-semibold">Role: </span>
                  {task?.team.lead?.role}
                </p>
              </Link>
            </div>
            {task.team.members.map(
              (member, index) =>
                // Check if the member is not the lead
                member._id !== task.team.lead._id && (
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
        </div>

       
      </div>
    </div>
  );
};

export default TaskDataCard;
