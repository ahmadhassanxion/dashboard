import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://xeno-pi.vercel.app",
  // baseURL: "https://xeno-3dfkg42x.b4a.run",
  baseURL: 'http://localhost:5000',
  
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
