/* eslint-disable react/prop-types */
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EditBtn = ({id , route}) => {
    const navigate = useNavigate();
    const handleChange = () => {
        navigate(`/${route}/${id}`);
    }
  return (
        <div>
      <div className="block space-y-4 md:flex md:space-y-0 md:space-x-4 rtl:space-x-reverse">
    <button
      className="mt-[7px] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm py-[10px] px-[12px] mb-2 "
      type="button"
      onClick={handleChange}
      
    >
      <FaPencilAlt />
    </button>
    </div>
    </div>
  );
}

export default EditBtn