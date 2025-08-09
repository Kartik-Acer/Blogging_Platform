"use client"

import "../styles/CreateBlog.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createblog } from "../services/api"
import BlogEditor from "./BlogEditor"

const CreateBlog = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [featuredImage, setFeaturedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !category.trim()) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("excerpt", excerpt)
      formData.append("category", category)
      formData.append("tags", tags)

      if (featuredImage) {
        formData.append("featuredImage", featuredImage)
      }

      const response = await createblog(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      navigate(`/blog/${response.data.blog._id}`)
    } catch (error) {
      console.error("Error creating blog:", error)
      setError(error.response?.data?.message || "Failed to create blog")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Blog</h1>
          <p className="mt-2 text-gray-600">Share your thoughts with the world</p>
        </div>

        {error && <div className="alert alert-error mb-6">{error}</div>}

        <div className="card">
          <BlogEditor
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            excerpt={excerpt}
            setExcerpt={setExcerpt}
            category={category}
            setCategory={setCategory}
            tags={tags}
            setTags={setTags}
            featuredImage={featuredImage}
            setFeaturedImage={setFeaturedImage}
            onSubmit={handleSubmit}
            loading={loading}
            submitText="Publish Blog"
          />
        </div>
      </div>
    </div>
  )
}

export default CreateBlog
