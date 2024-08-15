/* eslint-disable react/prop-types */



const Sidebar = ({ onAddMember , users }) => {
 

  

  const handleUserClick = (user) => {
    onAddMember(user);
  };

  return (
    <div className="w-60 p-4 border-r border-gray-300 bg-gray-50 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Available Users</h2>
      <ul>
        {users?.map((user , index) => (
          <li
            key={index}
            className="p-2 mb-2 bg-white rounded-lg shadow hover:bg-gray-100 cursor-pointer"
            onClick={() => handleUserClick(user)}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
