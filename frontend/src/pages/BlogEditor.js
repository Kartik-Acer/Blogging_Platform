"use client"

import { useState, useRef } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { Upload, X } from "lucide-react"
import "../styles/BlogEditor.css"

const BlogEditor = ({
  title,
  setTitle,
  content,
  setContent,
  excerpt,
  setExcerpt,
  category,
  setCategory,
  tags,
  setTags,
  featuredImage,
  setFeaturedImage,
  onSubmit,
  loading,
  submitText = "Publish Blog",
}) => {
  const [imagePreview, setImagePreview] = useState(featuredImage || "")
  const fileInputRef = useRef(null)

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "script",
    "indent",
    "direction",
    "color",
    "background",
    "align",
    "link",
    "image",
    "video",
  ]

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFeaturedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFeaturedImage(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="form-label">Blog Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Enter your blog title..."
            required
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="form-label">Excerpt (Optional)</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="form-textarea"
            placeholder="Brief description of your blog..."
          />
        </div>

        {/* Category and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Category *</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
              placeholder="e.g., Technology, Travel, Food"
              required
            />
          </div>

          <div>
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="form-input"
              placeholder="react, javascript, web development"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="form-label">Featured Image (Optional)</label>

          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Featured"
                className="w-full object-cover rounded-md"
                style={{ height: "16rem" }}
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 btn btn-danger"
                style={{ padding: "0.25rem", borderRadius: "50%" }}
              >
                <X style={{ width: "1rem", height: "1rem" }} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <Upload className="text-gray-400 mx-auto mb-2" style={{ width: "3rem", height: "3rem" }} />
              <p className="text-gray-600">Click to upload featured image</p>
              <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {/* Content Editor */}
        <div>
          <label className="form-label">Content *</label>
          <div className="bg-white">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Write your blog content here..."
              style={{ height: "400px", marginBottom: "50px" }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Publishing..." : submitText}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BlogEditor
