import UserDataTable from "./Components/UserDataTable"
import AddUser from "./Pages/AddUser"


const User = () => {
  return (
    <div>
        <div className="flex justify-between items-center p-4">
            
        <h1 className="text-4xl ">Users</h1>
        <AddUser />
        </div>
        <UserDataTable />
    </div>
  )
}

export default User