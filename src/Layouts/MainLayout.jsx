import { Link, Outlet } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import Header from "../Components/Header";
import { useState } from "react";
import Footer from "../Components/Footer";
import SideBar from "../Components/SideBar";

const MainLayout = () => {
    const [toggle, setToggle] = useState(true);
  return (
    <div>
  <Header/>

    <SideBar toggle={toggle} setToggle={setToggle} />

      <div
        className={`p-4

      ${toggle ? "ml-64" : "ml-14"}
 
       `}
      >
        <div className="p-4 rounded-lg dark:border-gray-700 mt-14">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout