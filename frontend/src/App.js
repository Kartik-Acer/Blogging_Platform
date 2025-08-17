import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import Navbar from "./component/Navbar"
import Footer from "./component/Footer"
import Home from "./component/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import CreateBlog from "./pages/CreateBlog"
import EditBlog from "./pages/EditBlog"
import BlogDetail from "./pages/BlogDetail"
import AdminDashboard from "./pages/AdminDashboard"
import EditProfile from "./pages/EditProfile"
import ChangePassord from "./pages/ChangePassword"
import './App.css';
import { Import } from "lucide-react"


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  const token = localStorage.getItem("token");
  return (
   <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/profile" element={ token ? <Profile/> : <Navigate to="/login" replace/>}/>
              <Route path="/EditProfile" element={token ? <EditProfile/> : <Navigate to="/login" replace/>}/>
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/create-blog" element={token ? <CreateBlog /> : <Navigate to="/login" replace/>} />
              <Route path="/edit-blog/:id" element={token ? <EditBlog /> : <Navigate to="/login" replace/>} />
              <Route path="/adminDashboard" element={token ? <AdminDashboard/> : <Navigate to="/login" replace/>}/>
              <Route path="/change-password" element={token ? <ChangePassord/> : <Navigate to="/login" replace/>}/>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
