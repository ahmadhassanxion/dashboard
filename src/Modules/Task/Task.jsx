import TaskDataTable from "./Components/TaskDataTable";
import AddTask from "./Pages/AddTask";



const Task = () => {
  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-4xl ">Tasks</h1>
        <AddTask />
      </div>
      <TaskDataTable />
    </div>
  );
};

export default Task;
