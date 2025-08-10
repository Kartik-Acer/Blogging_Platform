"use client"

import "../styles/BlogDetail.css"
import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { getBlogDetail, likeblog, commentblog, deleteblog } from "../services/api"
import { Calendar, User, Heart, MessageCircle, Eye, Edit, Trash2, Send } from "lucide-react"

const BlogDetail = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isDisplay, setIsDisplay] = useState(false)

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name")
  const {
    data: blog,
    isLoading,
    error,
  } = useQuery(
    ["blog", id],
    async () => {
      //const response = await axios.get(`/api/blogs/${id}`)
      const response = await getBlogDetail(id);
      if(response.data.author.username === userName){
         setIsDisplay(true)
      }
      const blogData = response.data
      setLikesCount(blogData.likes.length)
      return blogData
    },
    {
      enabled: !!id,
    },
  )

  const likeMutation = useMutation(
    async () => {
      const response = await likeblog(id)
      return response.data
    },
    {
      onSuccess: (data) => {
        setIsLiked(data.isLiked)
        setLikesCount(data.likesCount)
      },
      onError: () => {
        // Handle like without authentication
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
        setIsLiked(!isLiked)
      },
    },
  )

  const commentMutation = useMutation(
    async (content) => {
      const response = await commentblog(id, { content })
      return response.data
    },
    {
      onSuccess: () => {
        setComment("")
        queryClient.invalidateQueries(["blog", id])
      },
    },
  )

  const deleteMutation = useMutation(
    async () => {
      await deleteblog(id)
    },
    {
      onSuccess: () => {
        window.location.href = "/"
      },
    },
  )

  const handleLike = () => {
    likeMutation.mutate()
  }

  const handleComment = (e) => {
    e.preventDefault()
    if(token == null){
      window.confirm("please log in to comment")
    }
     else if (comment.trim()) {
      commentMutation.mutate(comment)
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      deleteMutation.mutate()
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" style={{ width: "4rem", height: "4rem" }}></div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Blog not found</h2>
          <p className="text-gray-600 mb-4">The blog you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Blog Header */}
        <div className="mb-8">
          {blog.featuredImage && (
            <img
              src={blog.featuredImage || "/placeholder.svg"}
              alt={blog.title}
              className="w-full object-cover rounded-lg mb-6"
              style={{ height: "20rem" }}
            />
          )}
          
          {isDisplay ? (
          <div className="flex items-center justify-between mb-4">
            <span className="badge badge-primary">{blog.category}</span>
            <div className="flex space-x-2">
              <Link to={`/edit-blog/${blog._id}`} className="btn btn-secondary">
                <Edit style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                <Trash2 style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
                Delete
              </button>
            </div>
          </div> ) : (
            <></>
          )}

          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} className="text-gray-400" />
                <span className="text-gray-600">
                  {blog.author.firstName} {blog.author.lastName}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} className="text-gray-400" />
                <span className="text-gray-600">{formatDate(blog.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 ${
                  isLiked ? "text-red-600" : "text-gray-600"
                } hover:text-red-600 transition-colors`}
              >
                <Heart style={{ width: "1rem", height: "1rem" }} fill={isLiked ? "currentColor" : "none"} />
                <span>{likesCount}</span>
              </button>
              <div className="flex items-center space-x-1 text-gray-600">
                <MessageCircle style={{ width: "1rem", height: "1rem" }} />
                <span>{blog.comments.length}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Eye style={{ width: "1rem", height: "1rem" }} />
                <span>{blog.views}</span>
              </div>
            </div>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span key={index} className="badge badge-secondary">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>

        {/* Author Info */}
        <div className="card mb-8">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-4">About the Author</h3>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h4 className="font-semibold">
                  {blog.author.firstName} {blog.author.lastName}
                </h4>
                <p className="text-gray-600 mt-2">{blog.author.bio || "This author hasn't written a bio yet."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="card">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-6">Comments ({blog.comments.length})</h3>

            {/* Add Comment Form */}
            <form onSubmit={handleComment} className="mb-6">
              <div className="form-group">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="form-textarea"
                  rows={3}
                  placeholder="Write a comment..."
                  required
                />
              </div>
              <button type="submit" disabled={commentMutation.isLoading} className="btn btn-primary">
                <Send style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
                {commentMutation.isLoading ? "Posting..." : "Post Comment"}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {blog.comments.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                blog.comments.map((comment) => (
                  <div key={comment._id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold">
                        {comment.user.firstName} {comment.user.lastName}
                      </span>
                      <span className="text-gray-500 text-sm">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
