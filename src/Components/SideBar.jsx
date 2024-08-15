/* eslint-disable react/prop-types */
import { FaAngleLeft } from "react-icons/fa";

import { Link } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { RiTeamFill } from "react-icons/ri";
import { MdAddTask } from "react-icons/md";
import { IoMdChatbubbles } from "react-icons/io";
import { RiUserSettingsFill } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
const SideBar = ({toggle , setToggle}) => {
 const user = JSON.parse(localStorage.getItem('userData'));

  const routes = [
    {
      path: "/",
      name: "Dashboard",
      icon: <FaChartPie />,
    },
    {
      path: "/users",
      name: "Users",
      icon: <FaUsers />,
    },
    {
      path: "/products",
      name: "Products",
      icon: <AiFillProduct />,
    },
    {
      path: "/teams",
      name: "Teams",
      icon: <RiTeamFill />,
    },
    {
      path: "/tasks",
      name: "Tasks",
      icon: <MdAddTask />,
    },
    {
      path: "/chat",
      name: "Chat",
      icon: <IoMdChatbubbles />,
    },
    {
      path: "/roles",
      name: "Roles",
      icon: <RiUserSettingsFill />,
    },

    {
      path: `/singleUser/${user._id}`,
      name: "Profile",
      icon: <FaUserEdit />,
    },
  ];
  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-40 duration-300 ${
        toggle ? "w-64" : "w-[3.5rem]"
      } h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 d`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white ">
        <div
          className="absolute right-[-33px] top-[5.5rem] bg-gray-200 rounded-[10px] rounded-bl-[0px] rounded-tl-[0px] p-[8px] cursor-pointer sideArrow"
          onClick={() => setToggle(!toggle)}
        >
          <FaAngleLeft
            className={`${toggle ? "rotate-180" : "rotate-0"}  duration-300`}
          />
        </div>
        <ul className="space-y-2 font-medium">
          {
            routes.map((route , index)=>{
return (
  <li key={index}>
    <Link
      to={route.path}
      className="flex items-center p-2 text-gray-900 rounded-lg  group"
    >
      {route.icon}
      <span
        className={`flex-1 ms-3 whitespace-nowrap ${toggle ? "" : "hidden"}`}
      >
        {route.name}
      </span>
    </Link>
  </li>
);
            })
          }
          
        </ul>
      </div>
    </aside>
  );
}

export default SideBar