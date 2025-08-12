"use client"

import "../styles/Home.css"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "react-query"
import { getblog } from "../services/api"
import { Search, Filter, Calendar, User, Heart, MessageCircle, Eye } from "lucide-react"

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchBlogs = async ({ queryKey }) => {
    const [, page, search, category] = queryKey
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "9",
    })

    if (search) params.append("search", search)
    if (category) params.append("category", category)
    //const response = await axios.get(`/api/blogs?${params}`)
    const response = await getblog(params);
    return response.data
  }

  const { data, isLoading, error } = useQuery(["blogs", currentPage, searchTerm, selectedCategory], fetchBlogs, {
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const stripHtml = (html) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Failed to load blogs. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <div className="text-center">
            <h1 className="hero-title">Welcome to BlogHub</h1>
            <p className="hero-subtitle">Discover amazing stories, share your thoughts, and connect with writers</p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hero-search">
              <div className="hero-search-form">
                <div className="hero-search-input-group">
                  <Search className="hero-search-icon" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search blogs..."
                    className="hero-search-input"
                  />
                </div>

                <div className="hero-search-select">
                  <Filter className="hero-search-icon" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="hero-search-select"
                  >
                    <option value="">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Business">Business</option>
                    <option value="Business">Education</option>
                  </select>
                </div>

                <button type="submit" className="hero-search-btn">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container py-12">
        {isLoading ? (
          <div className="blog-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="loading-skeleton" style={{ height: "12rem" }}></div>
                <div className="card-body">
                  <div className="loading-skeleton mb-2" style={{ height: "1rem" }}></div>
                  <div className="loading-skeleton mb-4" style={{ height: "1rem", width: "75%" }}></div>
                  <div className="loading-skeleton mb-2" style={{ height: "0.75rem" }}></div>
                  <div className="loading-skeleton mb-4" style={{ height: "0.75rem", width: "50%" }}></div>
                  <div className="flex justify-between items-center">
                    <div className="loading-skeleton" style={{ height: "0.75rem", width: "25%" }}></div>
                    <div className="loading-skeleton" style={{ height: "0.75rem", width: "25%" }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data?.blogs?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-2">No blogs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          <>
            <div className="blog-grid">
              {data?.blogs?.map((blog) => (
                <article key={blog._id} className="blog-card">
                  {blog.featuredImage && (
                    <img src={blog.featuredImage || "/placeholder.svg"} alt={blog.title} className="blog-card-image" />
                  )}

                  <div className="blog-card-content">
                    <div className="blog-card-header">
                      <span className="badge badge-primary">{blog.category}</span>
                      <span className="blog-card-stat">
                        <Calendar style={{ width: "1rem", height: "1rem", marginRight: "0.25rem" }} />
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>

                    <h2 className="blog-card-title">
                      <Link to={`/blog/${blog._id}`} className="">
                        {blog.title}
                      </Link>
                    </h2>

                    <p className="blog-card-excerpt line-clamp-3">
                      {blog.excerpt || stripHtml(blog.content).substring(0, 150) + "..."}
                    </p>

                    <div className="blog-card-footer">
                      <div className="blog-card-author">
                        <User style={{ width: "1rem", height: "1rem", marginRight: "0.25rem" }} />
                        <span className="text-sm text-gray-600">
                          {blog.author.firstName} {blog.author.lastName}
                        </span>
                      </div>

                      <div className="blog-card-stats">
                        <span className="blog-card-stat">
                          <Heart style={{ width: "1rem", height: "1rem", marginRight: "0.25rem" }} />
                          {blog.likes.length}
                        </span>
                        <span className="blog-card-stat">
                          <MessageCircle style={{ width: "1rem", height: "1rem", marginRight: "0.25rem" }} />
                          {blog.comments.length}
                        </span>
                        <span className="blog-card-stat">
                          <Eye style={{ width: "1rem", height: "1rem", marginRight: "0.25rem" }} />
                          {blog.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {data?.pagination?.pages > 1 && (
              <div className="pagination">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>

                  {[...Array(data.pagination.pages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`pagination-btn ${
                        currentPage === index + 1 ? "pagination-btn pagination-btn-active" : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, data.pagination.pages))}
                    disabled={currentPage === data.pagination.pages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
