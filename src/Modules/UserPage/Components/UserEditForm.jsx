import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../Utils/axios";
import { updateUser } from "../SingleUserSlice";
import toast from "react-hot-toast"; // If you're using toast notifications

const UserEditForm = () => {
  const user = useSelector((state) => state.SingleUserSlice);
  const dispatch = useDispatch();
  const [view, setView] = useState(false);
   const [allRoles, setAllRoles] = useState([]);
   useEffect(() => {
     const getRoles = async () => {
       const response = await axiosInstance.get("/api/roles/allRoles");
       console.log(response.data);
       setAllRoles(response.data);
     };
     getRoles();
   }, []);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    isAdmin: false,
    role: "",
  });

  useEffect(() => {
    setData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      phone: user.phone || "",
      isAdmin: user.isAdmin || false,
      role: user.role._id || "",
    });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(data);
      

      const response = await axiosInstance.put(
        `/api/users/updateUser/${user._id}`,
        data
      );
      console.log(response);

      dispatch(updateUser(response.data));
      toast.success("User updated successfully!");
    } catch (err) {
      toast.error("Error updating user!");
      console.log(err);
    }
  };

  return (
    <div className="relative px-4 w-full max-w-md max-h-full">
      <div className="relative h-full bg-white rounded-lg shadow ">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
          <h3 className="text-lg font-semibold text-gray-900 ">Update User</h3>
        </div>

        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={(e) => setData({ ...data, name: e.target.value })}
                value={data.name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder="Type user name"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setData({ ...data, email: e.target.value })}
                value={data.email}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder="example@gmail.com"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="role"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Role
              </label>
              <select
                id="role"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
              >
                <option value="">Choose Role</option>
                {allRoles.map((role, index) => {
                  return (
                    <option key={index} value={role._id}>
                      {role.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                New Password
              </label>
              <input
                type={view ? "text" : "password"}
                // name="password"
                id="password"
                onChange={(e) => setData({ ...data, password: e.target.value })}
                // value={data.password}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                name="new-password"
                autoComplete='new-password'
                
              />
              <div className="flex items-start  ml-[5px] mt-[5px]">
                <div className="flex items-center h-5">
                  <input
                    id="view-password"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "
                    onChange={(e) => {
                      setView(e.target.checked);
                    }}
                  />
                </div>
                <label
                  htmlFor="view-password"
                  className="ms-2 text-sm font-medium text-gray-900 "
                >
                  View Password
                </label>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                value={data.phone}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder="0311-456-7890"
                required
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="admin"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Admin Privileges
              </label>
              <select
                id="admin"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                value={data.isAdmin}
                onChange={
                  (e) =>
                    setData({ ...data, isAdmin: e.target.value === "true" }) // Convert string to boolean
                }
              >
                <option value="">Select Admin Status</option>
                <option value="true">Grant Admin Privileges</option>
                <option value="false">Revoke Admin Privileges</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEditForm;
