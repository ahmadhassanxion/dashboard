/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";


const TaskCard = ({id , type , color}) => {
  return (
    <div className="flex-1">
      <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 ">
        <div className="flex items-center justify-between mb-4">
          <h5
            className={`text-xl font-bold leading-none ${color} `}
          >
            {type} Task
          </h5>
        </div>
        <div className="flow-root">
          {/* {data.length !== 0 ? (
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {data.map((item) => {
                return (
                  <li
                    className="py-3 px-2 cursor-pointer rounded sm:py-4 hover:bg-slate-200"
                    key={item._id}
                  >
                    <Link to={`/singleProduct/${item._id}`}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="w-8 h-8 rounded-full"
                            src={`http://localhost:3000/products/${item.imagePath}/${item.image}`}
                            alt="Neil image"
                          />
                        </div>
                        <div className="flex-1 min-w-0 ms-4">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {item.lastChanged}
                          </p>
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {item.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            // console.log(data[0].name)

            "You Have Nothing"
          )} */}
        </div>
      </div>
    </div>
  );
}

export default TaskCard