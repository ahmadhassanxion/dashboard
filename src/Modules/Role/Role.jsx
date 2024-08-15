import RoleDataTable from "./Components/RoleDataTable";
import AddRole from "./Pages/AddRole";

const Role = () => {
  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-4xl ">Roles</h1>
        <AddRole />
      </div>
      <RoleDataTable />
    </div>
  );
};

export default Role;
