/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaChartPie, FaUserEdit } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { RiTeamFill, RiUserSettingsFill } from "react-icons/ri";
import { MdAddTask, MdCategory } from "react-icons/md";
import { IoMdChatbubbles } from "react-icons/io";
import { ImBlog } from "react-icons/im";

const SideBar = ({ toggle, setToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname; // Get the full path
  const user = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    console.log(`Current route: ${currentPath}`);
    console.log("User permissions:", user.role.permissions);
  }, [currentPath, user.role.permissions]);

  const hasPermission = (resource, action) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.isAdmin) return true;
    if (!userData || !userData.role || !userData.role.permissions) return false;
    const resourcePermissions = userData.role.permissions.find(
      (permission) => permission.resource === resource
    );
    if (!resourcePermissions) {
      return true;
    }
    return userData.role.permissions.some(
      (permission) =>
        permission.resource === resource && permission.actions.includes(action)
    );
  };

  const routes = [
    {
      path: "/",
      name: "Dashboard",
      icon: <FaChartPie />,
      resource: "dashboard",
    },
    { path: "/users", name: "Users", icon: <FaUsers />, resource: "users" },
    {
      path: "/products",
      name: "Products",
      icon: <AiFillProduct />,
      resource: "products",
    },
    { path: "/teams", name: "Teams", icon: <RiTeamFill />, resource: "teams" },
    { path: "/tasks", name: "Tasks", icon: <MdAddTask />, resource: "tasks" },
    {
      path: "/chat",
      name: "Chat",
      icon: <IoMdChatbubbles />,
      resource: "chats",
    },
    {
      path: "/roles",
      name: "Roles",
      icon: <RiUserSettingsFill />,
      resource: "roles",
    },
    {
      path: "/blogs",
      name: "Blogs",
      icon: <ImBlog />,
      children: [
        {
          path: "/blogs/categories",
          name: "Category",
          icon: <MdCategory />,
          resource: "category",
        },
        {
          path: "/blogs/website",
          name: "Website",
          icon: <MdCategory />,
          resource: "website",
        },
      ],
      resource: "blogs",
    },
    {
      path: `/singleUser/${user._id}`,
      name: "Profile",
      icon: <FaUserEdit />,
      resource: "profile",
    },
  ];

  const accessibleRoutes = routes.filter((route) =>
    hasPermission(route.resource, "view")
  );

  const [openDropdown, setOpenDropdown] = useState(null);

  const handleToggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-40 duration-300 ${
        toggle ? "w-64" : "w-[3.5rem]"
      } h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
        <div
          className="absolute right-[-33px] top-[5.5rem] bg-gray-200 rounded-[10px] rounded-bl-[0px] rounded-tl-[0px] p-[8px] cursor-pointer sideArrow"
          onClick={() => setToggle(!toggle)}
        >
          <FaAngleLeft
            className={`${toggle ? "rotate-180" : "rotate-0"} duration-300`}
          />
        </div>
        <ul className="space-y-2 font-medium">
          {accessibleRoutes.map((route, index) => (
            <li key={index}>
              {/* Parent Link */}
              <Link
                to={route.path}
                className={`flex items-center p-2 text-gray-900 rounded-lg group ${
                  currentPath === route.path ? "bg-gray-500 text-white" : ""
                }`}
                onClick={() => route.children && handleToggleDropdown(index)}
              >
                {route.icon}
                <span
                  className={`flex-1 ms-3 whitespace-nowrap ${
                    toggle ? "" : "hidden"
                  }`}
                >
                  {route.name}
                </span>
              </Link>

              {/* Dropdown Menu */}
              {route.children && (
                <ul
                  className={`transition-all  pl-3 duration-300 overflow-hidden ${
                    openDropdown === index ? "max-h-40" : "max-h-0"
                  }`}
                >
                  {route.children.map((child, childIndex) => (
                    <li key={childIndex}>
                      <Link
                        to={child.path}
                        className={`flex items-center p-2 text-gray-900 rounded-lg group ${
                          currentPath === child.path
                            ? "bg-gray-500 text-white"
                            : ""
                        }`}
                      >
                        {child.icon}
                        <span
                          className={`flex-1 ms-3 whitespace-nowrap ${
                            toggle ? "" : "hidden"
                          }`}
                        >
                          {child.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;
