import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTeamImage } from "../SingleTeamSlice";
// import TeamLeadLogo from "../../../assets/team-leader.png";
import axiosInstance from "../../../Utils/axios";
import { Link } from "react-router-dom";

const TeamDataCard = () => {
  const team = useSelector((state) => state.SingleTeamSlice);
  const [userImage, setUserImage] = useState(null);
  const dispatch = useDispatch();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        // Sending the API request to update the image
        const response = await axiosInstance.put(
          `/api/teams/updateTeamImage/${team._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(response);
        // Assuming the response contains the new image URL
        const newImageUrl = response.data.imageUrl;

        // Update the image in the Redux store
        dispatch(updateTeamImage(newImageUrl));

        // Update the local state
        setUserImage(newImageUrl);
      } catch (error) {
        console.error("Error uploading the image:", error);
      }
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow p-[20px]">
      <div className="flex flex-col items-center pb-10">
        <div className="overflow-hidden w-full max-h-[300px] flex gap-8 justify-center items-center rounded-md shadow-lg border-gray-100 mb-3">
          <img
            className="w-full flex-1 max-h-[90px]  rounded shadow-lg border-gray-100 "
            alt="User image"
            src={userImage || team.imageUrl}
            onClick={() => document.getElementById("image").click()}
          />
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex-[8]">
            <h2 className="text-2xl font-semibold">{team.name}</h2>
            <ul className="flex justify-start items-center gap-2">
              <li className="text-[20px]">
                <span className="font-semibold"> Members:</span>{" "}
                {team.members.length}
              </li>
              <li className="text-[20px]">
                <span className="font-semibold">Lead:</span> {team.lead.name}
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2  ">
            <div className="flex flex-col justify-start items-start p-2 gap-2 shadow-lg">
              <Link
                to={`/singleUser/${team.lead._id}`}
                className="flex flex-col justify-start items-start p-2 gap-2 w-full"
              >
                <img
                  src={team.lead.imageUrl}
                  alt={team.lead.name}
                  className="max-h-[130px] w-full object-cover  object-top rounded-md"
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
                  {team.lead.role.name}
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
                        className="max-h-[130px] w-full object-cover object-top rounded-md"
                      />
                      <h3>
                        
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
                        {member.role.name}
                      </p>
                    </Link>
                  </div>
                )
            )}
          </div>
        </div>

        <div className="flex mt-4 md:mt-6">
          <button
            type="button"
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamDataCard;
