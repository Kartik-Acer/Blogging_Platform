import axios from "axios";

const API = axios.create({
  baseURL: "https://blogging-platform-backend-lqai.onrender.com/api",
});
//https://blogging-platform-backend-lqai.onrender.com/api
//http://localhost:5000/api
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

export const getblog = (params, data) => API.get(`/blogs?${params}`, data)

export const getUsersblog = (data) => API.get("/users/blogs", data)

export const createblog = (data) => API.post("/blogs", data)

export const getBlogDetail = (id,data) => API.get(`/blogs/${id}`, data)

export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data)

export const getAdminblog = (data) => API.get("/admin/blogs", data)

export const getAdminusers = (data) => API.get("/admin/users", data)

export const likeblog = (id, data) => API.post(`/blogs/${id}/like`, data)

export const commentblog = (id, data) => API.post(`/blogs/${id}/comments`, data)

export const deleteblog = (id) => API.delete(`/blogs/${id}`)

export const deleteblogByAmin  = (blogId) => API.delete(`/admin/blogs/${blogId}`)

export const updateProfile = (data) => API.put("/user/profile", data);

export const toggleUsers = (id, data) => API.put(`/admin/users/${id}/deactivate`, data);


