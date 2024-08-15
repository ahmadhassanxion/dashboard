/* eslint-disable react/prop-types */
import { FaEye } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


const ViewBtn = ({id , route}) => {
    const navigate = useNavigate();
    const handleView = () => {
        navigate(`/${route}/${id}`);
    }
  return (
    <div>
      <div className="block space-y-4 md:flex md:space-y-0 md:space-x-4 rtl:space-x-reverse">
        <button
          className="mt-[7px] text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm py-[10px] px-[12px] mb-2"
          type="button"
          onClick={handleView}
        >
          <FaEye />
        </button>
      </div>
    </div>
  );
}

export default ViewBtn