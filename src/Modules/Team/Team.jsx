import TeamDataTable from "./Components/TeamDataTable";
import AddTeam from "./Pages/AddTeam";


const Team = () => {
  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-4xl ">Teams</h1>
        <AddTeam />
      </div>
      <TeamDataTable />
    </div>
  );
};

export default Team;
