import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRole } from "../SingleRoleSlice";
import axiosInstance from "../../../Utils/axios";
import toast from "react-hot-toast";

const EditRoleCard = () => {
  const role = useSelector((state) => state.SingleRoleSlice);
  const dispatch = useDispatch();

  const [data, setData] = useState({
    name: "",
    description: "",
    permissions: {}, // Permissions for each page
  });

  const [availablePages, setAvailablePages] = useState([
    { name: "users" },
    { name: "products" },
    { name: "tasks" },
    { name: "teams" },
  ]);

  useEffect(() => {
    // Set initial data from the role state
    setData({
      name: role.name || "",
      description: role.description || "",
      permissions:
        role.permissions?.reduce((acc, { resource, actions }) => {
          acc[resource] = actions;
          return acc;
        }, {}) || {},
    });
  }, [role]);

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

      const response = await axiosInstance.put(
        `/api/roles/updateRole/${role._id}`,
        payload
      );

      if (response.status !== 200) {
        toast.error("Error Updating Role!");
      } else {
        dispatch(updateRole(response.data));
        toast.success("Role Updated Successfully!");
      }
    } catch (err) {
      toast.error("Error While Updating Role!");
      console.log(err);
    }
  };

  return (
    <div className="relative px-4 w-full max-w-md max-h-full">
      <div className="relative h-full bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900">Update Role</h3>
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
                onChange={(e) => setData({ ...data, name: e.target.value })}
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
                  <h4 className="font-semibold capitalize flex-[2]">
                    {page.name}
                  </h4>
                  <div className="flex gap-4 flex-[6]">
                    {["view", "edit", "delete"].map((permission) => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            data.permissions[page.name]?.includes(permission) ||
                            false
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
            Update Role
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRoleCard;
