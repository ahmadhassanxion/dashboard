import { useParams } from "react-router-dom";


import { useEffect } from "react";
import axiosInstance from "../../../Utils/axios";
import { updateRole } from "../SingleRoleSlice";
import { useDispatch } from "react-redux";
import RoleDataCard from "../Components/RoleDataCard";
import EditRoleCard from "../Components/EditRoleCard";


const SingleRole = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const getTask = async () => {
      try {
        const response = await axiosInstance.get(`/api/roles/singleRole/${id}`);
        dispatch(updateRole(response.data));
        console.log(response);
      } catch (e) {
        console.error(e.message);
      }
    };
    getTask();
  }, [id, dispatch]);

  return (
    <div className="flex flex-col gap-[10px]">
      <div className={`grid grid-cols-1 gap-4 md:grid-cols-2`}>
        <RoleDataCard />
        <EditRoleCard />
      </div>
     
    </div>
  );
};

export default SingleRole;
