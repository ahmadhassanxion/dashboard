import bannerImage from "../../../assets/login-banner.png";
import Logo from "../../../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Utils/axios";
import { useDispatch } from "react-redux";
import { updateAuthSlice } from "../AuthSlice";
import toast from "react-hot-toast";


const Login = () => {
    const dispatch = useDispatch();
 const [data , setData] = useState({
    email:'',
    password:'',
 })
  const navigate = useNavigate();
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axiosInstance.post("/api/users/loginUser" , data);
        console.log(response);
        dispatch(updateAuthSlice(response.data));
        if(response.data.status==404){
            toast.error(response.data.message);
        }else{
            localStorage.setItem('isLogin',true);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userData", JSON.stringify(response.data.user));
            toast.success("Login successful");
            navigate('/');
        }
     
    } catch (err) {
      console.log(err);
      toast.error("Login Failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen gap-[30px] bg-gray-300">
      <div className="p-[20px] bg-white flex flex-col items-center justify-center  rounded-[10px] h-[auto] md:flex-row w-[80vw]  gap-[30px]">
        <div className="h-[auto] w-full  md:max-w-[600px]">
          <img src={bannerImage} alt="" className="w-100 h-100" />
        </div>
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 ">
          <div className="py-[20px] flex justify-center items-center pt-0">
            <img src={Logo} alt="" className="w-100 h-100" />
          </div>
          <form className="max-w-sm mx-auto" onSubmit={handelSubmit}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="name@flowbite.com"
                required
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Your Password
              </label>
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                required
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
