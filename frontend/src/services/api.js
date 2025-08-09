import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

//Interceptor to add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// API functions
export const register = (data) => API.post("/register", data)
export const login = (data) => API.post("/login", data)
export const getProfile = () => API.get("/auth/me")
export const getblog = (params,data) => API.get(`/blogs?${params}`,data)
export const createblog = (data) => API.post("/blogs", data)
