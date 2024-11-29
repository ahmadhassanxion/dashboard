const hasPermission = ( resource, action) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
     if (userData?.isAdmin) return true;
  if (!userData || !userData.role || !userData.role.permissions) return false;
//  const resourcePermissions = userData.role.permissions.find(
//    (permission) => permission.resource === resource
//  );
//  if(!resourcePermissions){
//     return true;
//  }
  return userData.role.permissions.some(
    (permission) =>
      permission.resource === resource && permission.actions.includes(action)
  );
};


export default hasPermission;