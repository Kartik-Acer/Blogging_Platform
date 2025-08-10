"use client"

import "../styles/EditBlog.css"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { getBlogDetail, updateBlog } from "../services/api"
import BlogEditor from "./BlogEditor"

const EditBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [featuredImage, setFeaturedImage] = useState(null)
  const [currentImage, setCurrentImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    data: blog,
    isLoading,
    error: fetchError,
  } = useQuery(
    ["blog", id],
    async () => {
      //const response = await axios.get(`/api/blogs/${id}`)
      const response = await getBlogDetail(id);
      return response.data
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        setTitle(data.title)
        setContent(data.content)
        setExcerpt(data.excerpt || "")
        setCategory(data.category)
        setTags(data.tags.join(", "))
        setCurrentImage(data.featuredImage)
      },
    },
  )

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

      const response = await updateBlog(id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      navigate(`/blog/${response.data.blog._id}`)
    } catch (error) {
      console.error("Error updating blog:", error)
      setError(error.response?.data?.message || "Failed to update blog")
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" style={{ width: "4rem", height: "4rem" }}></div>
      </div>
    )
  }

  if (fetchError || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Blog not found</h2>
          <p className="text-gray-600">The blog you're trying to edit doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Blog</h1>
          <p className="mt-2 text-gray-600">Update your blog post</p>
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
            submitText="Update Blog"
          />
        </div>
      </div>
    </div>
  )
}

export default EditBlog
