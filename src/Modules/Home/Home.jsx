import React, { useEffect, useState } from 'react';
import axiosInstance from "../../Utils/axios";
import { FaBox, FaUsers, FaTasks, FaChartLine, FaBlog, FaComments } from 'react-icons/fa';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Progress,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Badge,
} from "@material-tailwind/react";

const Home = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    tasks: 0,
    recentProducts: [],
    recentActivities: []
  });
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchData();
  }, []);

  // Set up WebSocket for real-time updates
  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}/ws/dashboard`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStats(prev => ({
        ...prev,
        ...data
      }));
    };

    return () => ws.close();
  }, []);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <Typography variant="h4" className="font-bold">
            Dashboard Overview
          </Typography>
          <div className="flex items-center space-x-4">
            <Tooltip content="Refresh Dashboard">
              <Button
                variant="text"
                color="blue-gray"
                className="p-2"
                onClick={() => window.location.reload()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </Button>
            </Tooltip>
          </div>
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs
          value={selectedTab}
          onChange={setSelectedTab}
          className="mt-4"
        >
          <Tab value="overview" label="Overview" />
          <Tab value="activity" label="Recent Activity" />
          <Tab value="products" label="Recent Products" />
          <Tab value="users" label="Users" />
          <Tab value="tasks" label="Tasks" />
        </Tabs>
      </div>

      {selectedTab === 'overview' && (
        <>
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-blue-500 text-white">
              <CardHeader className="flex items-center justify-between p-4">
                <div>
                  <Typography color="black" className="font-medium">
                    Total Products
                  </Typography>
                  <Typography color="black" className="text-2xl font-bold">
                    {formatNumber(stats.products)}
                  </Typography>
                  <Typography color="black" className="text-sm">
                    +5.2% from last month
                  </Typography>
                </div>
                <FaBox className="text-3xl" />
              </CardHeader>
              <CardBody>
                <Progress
                  value={stats.products > 0 ? (stats.products / 1000) * 100 : 0}
                  color="white"
                  className="w-full"
                />
              </CardBody>
            </Card>

            <Card className="bg-green-500 text-white">
              <CardHeader className="flex items-center justify-between p-4">
                <div>
                  <Typography color="black" className="font-medium">
                    Total Users
                  </Typography>
                  <Typography color="black" className="text-2xl font-bold">
                    {formatNumber(stats.users)}
                  </Typography>
                  <Typography color="black" className="text-sm">
                    +3.8% from last month
                  </Typography>
                </div>
                <FaUsers className="text-3xl" />
              </CardHeader>
              <CardBody>
                <Progress
                  value={stats.users > 0 ? (stats.users / 1000) * 100 : 0}
                  color="white"
                  className="w-full"
                />
              </CardBody>
            </Card>

            <Card className="bg-purple-500 text-white">
              <CardHeader className="flex items-center justify-between p-4">
                <div>
                  <Typography color="black" className="font-medium">
                    Active Tasks
                  </Typography>
                  <Typography color="black" className="text-2xl font-bold">
                    {formatNumber(stats.tasks)}
                  </Typography>
                  <Typography color="black" className="text-sm">
                    +2.5% from last month
                  </Typography>
                </div>
                <FaTasks className="text-3xl" />
              </CardHeader>
              <CardBody>
                <Progress
                  value={stats.tasks > 0 ? (stats.tasks / 1000) * 100 : 0}
                  color="white"
                  className="w-full"
                />
              </CardBody>
            </Card>

            <Card className="bg-orange-500 text-white">
              <CardHeader className="flex items-center justify-between p-4">
                <div>
                  <Typography color="white" className="font-medium">
                    Recent Activity
                  </Typography>
                  <Typography color="white" className="text-2xl font-bold">
                    {formatNumber(stats.recentProducts.length)}
                  </Typography>
                  <Typography color="white" className="text-sm">
                    +4.1% from last month
                  </Typography>
                </div>
                <FaChartLine className="text-3xl" />
              </CardHeader>
              <CardBody>
                <Progress
                  value={stats.recentProducts.length > 0 ? (stats.recentProducts.length / 100) * 100 : 0}
                  color="white"
                  className="w-full"
                />
              </CardBody>
            </Card>
          </div>

          {/* Quick Access Section */}
          <div className="mb-8">
            <Typography variant="h5" className="mb-4">
              Quick Access
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Button
                variant="text"
                color="blue"
                fullWidth
                className="h-32 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/products'}
              >
                <FaBox className="text-4xl mb-2" />
                <Typography className="font-medium">Products</Typography>
              </Button>

              <Button
                variant="text"
                color="green"
                fullWidth
                className="h-32 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/users'}
              >
                <FaUsers className="text-4xl mb-2" />
                <Typography className="font-medium">Users</Typography>
              </Button>

              <Button
                variant="text"
                color="purple"
                fullWidth
                className="h-32 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/tasks'}
              >
                <FaTasks className="text-4xl mb-2" />
                <Typography className="font-medium">Tasks</Typography>
              </Button>

              <Button
                variant="text"
                color="yellow"
                fullWidth
                className="h-32 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/blog'}
              >
                <FaBlog className="text-4xl mb-2" />
                <Typography className="font-medium">Blog</Typography>
              </Button>

              <Button
                variant="text"
                color="pink"
                fullWidth
                className="h-32 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/chats'}
              >
                <FaComments className="text-4xl mb-2" />
                <Typography className="font-medium">Chats</Typography>
              </Button>
            </div>
          </div>
        </>
      )}

      {selectedTab === 'activity' && (
        <div className="space-y-4">
          <Typography variant="h5" className="mb-4">Recent Activity</Typography>
          {stats.recentActivities.map((activity, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow border border-gray-100"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                    {activity.type[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <Typography className="font-medium">{activity.description}</Typography>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{new Date(activity.createdAt).toLocaleString()}</span>
                    <span>•</span>
                    <span>{activity.user?.name || 'System'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'products' && (
        <div className="space-y-4">
          <Typography variant="h5" className="mb-4">Recent Products</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.recentProducts.map((product, index) => (
              <Card key={index}>
                <CardHeader className="flex items-center justify-between">
                  <Typography variant="h6" color="blue-gray">
                    {product.name}
                  </Typography>
                  <div className="flex items-center space-x-2">
                    <Badge color="blue-gray" size="sm">
                      {product.category}
                    </Badge>
                    <Badge color="green" size="sm">
                      {product.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    <Typography color="blue-gray" className="font-medium">
                      {product.description.substring(0, 100)}...
                    </Typography>
                    <div className="flex items-center space-x-2">
                      <Avatar
                        src={product.uploadedBy?.avatar || ''}
                        alt={product.uploadedBy?.name}
                        size="sm"
                      />
                      <Typography color="gray" className="text-sm">
                        {product.uploadedBy?.name}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="pt-0">
                  <Button
                    variant="text"
                    size="sm"
                    color="blue-gray"
                    onClick={() => window.location.href = `/products/${product._id}`}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'users' && (
        <div className="space-y-4">
          <Typography variant="h5" className="mb-4">Recent Users</Typography>
          {/* Add users list here */}
        </div>
      )}

      {selectedTab === 'tasks' && (
        <div className="space-y-4">
          <Typography variant="h5" className="mb-4">Active Tasks</Typography>
          {/* Add tasks list here */}
        </div>
      )}
    </div>
  );
};

export default Home;