// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./Layouts/MainLayout";
import Home from "./Modules/Home/Home";
import User from "./Modules/UserPage/User";
import SingleUser from "./Modules/UserPage/Pages/SingleUser";
import Team from "./Modules/Team/Team";
import SingleTeam from "./Modules/Team/Pages/SingleTeam";
import Task from "./Modules/Task/Task";
import SingleTask from "./Modules/Task/Pages/SingleTask";
import PrivateRoute from "./Utils/PrivateRoute";
import Login from "./Modules/Auth/Pages/Login";
import Role from "./Modules/Role/Role";
import SingleRole from "./Modules/Role/Pages/SingleRole";
import Product from "./Modules/Product/Product";
import SingleProduct from "./Modules/Product/Pages/SingleProduct";
import Blog from "./Modules/Blog/Blog";
import BlogCategory from "./Modules/Blog/Pages/BlogCategory";
import SingleBlog from "./Modules/Blog/Pages/SingleBlog";
import Chats from "./Modules/chats/Chats";
import BlogWebsite from "./Modules/Blog/Pages/BlogWebsite";

const App = () => {
  return (
    <>
      <div>
        <Toaster />
      </div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="users" element={<User />} />
              <Route path="singleUser/:id" element={<SingleUser />} />
              <Route path="products" element={<Product />} />
              <Route path="singleProduct/:id" element={<SingleProduct />} />
              <Route path="tasks" element={<Task />} />
              <Route path="singleTask/:id" element={<SingleTask />} />
              <Route path="teams" element={<Team />} />
              <Route path="singleTeam/:id" element={<SingleTeam />} />
              <Route path="roles" element={<Role />} />
              <Route path="singleRole/:id" element={<SingleRole/>} />
              <Route path="blogs" element={<Blog />} />
              <Route path="singleBlog/:id" element={<SingleBlog />} />
              <Route path="blogs/categories" element={<BlogCategory />} />
              <Route path="blogs/website" element={<BlogWebsite />} />
              <Route path="chat" element={<Chats />} />

            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
