import {  Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../Modules/Auth/AuthSlice";
const IconProfile = () => {
  // const auth = useSelector(state=>state.AuthSlice);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [logOutToggle, setLogOutToggle] = useState(false);
const handelSignOut = () => {
  toast.success("Logged out Successfully");
  localStorage.removeItem("userData");
  localStorage.removeItem("token");
  localStorage.removeItem("isLogin");

  navigate("/login");

  dispatch(logout());
};

  return (
    <div>
      <div>
        <button
          type="button"
          className="flex text-sm bg-gray-800 rounded-full  "
          aria-expanded="false"
          onClick={() => setToggle(!toggle)}
        >
          <span className="sr-only">Open user menu</span>
          <img
            className="w-8 h-8 rounded-full"
            src={user.imageUrl}
            alt="user photo"
          />
        </button>
      </div>
      <div
        className={`"z-50 ${
          toggle ? "block" : "hidden"
        } absolute right-0 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow "
        id="dropdown-user"`}
      >
        <div className="px-4 py-3" role="none">
          <p className="text-sm text-gray-900 " role="none">
            {user.name}
          </p>
          <p
            className="text-sm font-medium text-gray-900 truncate "
            role="none"
          >
            {user.email}
          </p>
        </div>
        <ul className="py-1" role="none">
          <li>
            <Link
              to={`/singleUser/${user._id}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
              role="menuitem"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  "
              role="menuitem"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  "
              role="menuitem"
            >
              Chats
            </Link>
          </li>
          <li onClick={() => setLogOutToggle(!logOutToggle)}>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  "
              role="menuitem"
            >
              Sign out
            </a>
          </li>
        </ul>
      </div>
      <div
        tabIndex="-1"
        className={`${
          logOutToggle ? "flex" : "hidden"
        } bg-[rgba(0,0,0,0.5)] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow ">
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
              onClick={() => setLogOutToggle(!logOutToggle)}
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
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 ">
                Are you sure you want to logout?
              </h3>
              <button
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                onClick={handelSignOut}
              >
                Yes, I am sure
              </button>
              <button
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 "
                onClick={() => setLogOutToggle(!logOutToggle)}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconProfile;
