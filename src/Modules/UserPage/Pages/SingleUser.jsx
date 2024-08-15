import { useParams } from "react-router-dom";
import TaskCard from "../Components/TaskCard";
import UserDataCard from "../Components/UserDataCard";
import UserEditForm from "../Components/UserEditForm";
import { useEffect } from "react";
import axiosInstance from "../../../Utils/axios";
import { updateUser } from "../SingleUserSlice";
import { useDispatch } from "react-redux";

const SingleUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();


  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/singleUser/${id}`);
        console.log(response);
        dispatch(updateUser(response.data));
      } catch (e) {
        console.error(e.message);
      }
    };
    getUser();
  }, [id, dispatch]);



  return (
    <div className="flex flex-col gap-[10px]">
      <div className={`grid grid-cols-1 gap-4 md:grid-cols-2`}>
        <UserDataCard />
        <UserEditForm />
      </div>
      <div className="flex flex-col gap-[10px]">
        <div className="w-[100%] p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8">
          <h5 className="mb-2 text-3xl font-medium text-gray-900">
            Working Status of User
          </h5>
        </div>
        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-3">
          <>
            <TaskCard type="Pending" color="text-slate-500" />
            <TaskCard type="Successful" color="text-green-500" />
            <TaskCard type="Rejected" color="text-red-500" />
          </>
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
