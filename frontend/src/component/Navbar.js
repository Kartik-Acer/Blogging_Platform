"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, PenTool, Home, FileText, BarChart3, User, LogOut } from "lucide-react"
import "../styles/Navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
      // Try to get user data from localStorage or API
      const userData = localStorage.getItem("userData")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    setIsAuthenticated(false)
    setUser(null)
    setIsMenuOpen(false)
    navigate("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="navbar-brand">
              <PenTool className="mr-2" style={{ width: "2rem", height: "2rem", color: "#2563eb" }} />
              <span className="text-xl font-bold">BlogHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-nav">
            <Link to="/" className="flex items-center">
              <Home style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
              <span>Home</span>
            </Link>

            <Link to="/create-blog" className="flex items-center">
              <FileText style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
              <span>Write Blog</span>
            </Link>

            <Link to="/admin" className="flex items-center">
              <BarChart3 style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
              <span>Analytics</span>
            </Link>

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button className="flex items-center">
                  <User style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
                  <span>{user?.firstName || "User"}</span>
                </button>

                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    <User style={{ width: "1rem", height: "1rem" }} />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="dropdown-item"
                    style={{
                      width: "100%",
                      border: "none",
                      background: "none",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <LogOut style={{ width: "1rem", height: "1rem" }} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="navbar-toggle">
            <button onClick={toggleMenu} className="navbar-toggle">
              {isMenuOpen ? (
                <X style={{ width: "1.5rem", height: "1.5rem" }} />
              ) : (
                <Menu style={{ width: "1.5rem", height: "1.5rem" }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="navbar-mobile" style={{ display: isMenuOpen ? "block" : "none" }}>
            <div className="navbar-mobile">
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/create-blog"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="h-4 w-4" />
                <span>Write Blog</span>
              </Link>

              <Link
                to="/admin"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Link>

              {/* Mobile Authentication Section */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 hover:text-blue-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
