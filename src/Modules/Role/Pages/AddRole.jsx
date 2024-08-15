import { useState, useEffect } from "react";
import axiosInstance from "../../../Utils/axios";
import toast from "react-hot-toast";

const AddRole = () => {
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    permissions: {}, // Permissions for each page
  });

  const [availablePages, setAvailablePages] = useState([
    {name:"users"},{name:"products"},{name:"tasks"},{name:"teams"}
  ]);


  const handlePermissionsChange = (page, permission) => {
    setData((prevData) => {
      const currentPermissions = prevData.permissions[page] || [];
      if (currentPermissions.includes(permission)) {
        return {
          ...prevData,
          permissions: {
            ...prevData.permissions,
            [page]: currentPermissions.filter((perm) => perm !== permission),
          },
        };
      } else {
        return {
          ...prevData,
          permissions: {
            ...prevData.permissions,
            [page]: [...currentPermissions, permission],
          },
        };
      }
    });
  };

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     if (
       !data.name ||
       !data.description ||
       !Object.keys(data.permissions).length
     ) {
       toast.error("Please fill all fields");
       return;
     }

     // Convert the permissions object to the required array of objects
     const formattedPermissions = Object.entries(data.permissions).map(
       ([resource, actions]) => ({
         resource,
         actions,
       })
     );

     const payload = {
       ...data,
       permissions: formattedPermissions,
     };

     const response = await axiosInstance.post(
       "/api/roles/createRole",
       payload
     );

     if (response.status !== 201) {
       toast.error("Error Creating Role!");
     } else {
       setData({
         name: "",
         description: "",
         permissions: {},
       });
       toast.success("Role Created Successfully!");
       setToggle(!toggle);
     }
   } catch (err) {
     toast.error("Error While Creating Role!");
     console.log(err);
   }
 };


  return (
    <div>
      <button
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        type="button"
        onClick={() => setToggle(!toggle)}
      >
        Add Role
      </button>

      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden="true"
        className={`${
          toggle ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full bg-[rgba(0,0,0,0.4)]`}
      >
        <div className="relative p-4 w-full max-w-4xl max-h-full">
          <div className="relative bg-white rounded-lg shadow flex">
            <div className="flex-1 p-4 md:p-5">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Create New Role
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setToggle(!toggle)}
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
              </div>

              <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Role Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={data.name}
                      onChange={(e) =>
                        setData({ ...data, name: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Type role name"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Role Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 h-[100px]"
                      onChange={(e) =>
                        setData({ ...data, description: e.target.value })
                      }
                      value={data.description}
                      required
                      placeholder="Type role description"
                    ></textarea>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="permissions"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Set Permissions For Pages
                    </label>
                    {availablePages.map((page, index) => (
                      <div
                        key={index}
                        className="mb-2 flex gap-3 p-2 rounded-md bg-gray-50 border border-gray-300 text shadow-lg"
                      >
                        <h4 className="font-semibold capitalize flex-1">
                          {page.name}
                        </h4>
                        <div className="flex gap-4 flex-[8]">
                          {["view", "edit", "delete"].map((permission) => (
                            <label
                              key={permission}
                              className="flex items-center"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  data.permissions[page.name]?.includes(
                                    permission
                                  ) || false
                                }
                                onChange={() =>
                                  handlePermissionsChange(page.name, permission)
                                }
                                className="mr-2"
                              />
                              {permission.charAt(0).toUpperCase() +
                                permission.slice(1)}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Create Role
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRole;
