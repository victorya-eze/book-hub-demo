"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { addBook } from "@/lib/api"

interface User {
  email: string
  name: string
  isAdmin: boolean
  token: string
}


export default function AddBookPage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    summary: "",
    coverImage: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!parsedUser.isAdmin) {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.author.trim() || !formData.summary.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      await addBook(
        {
          title: formData.title.trim(),
          author: formData.author.trim(),
          description: formData.summary.trim(),
          image_url: formData.coverImage.trim() || undefined,
        },
        user!.token,
      )

      toast({
        title: "Success!",
        description: `"${formData.title}" has been added to the library.`,
      })

      setFormData({ title: "", author: "", summary: "", coverImage: "" })

      setTimeout(() => {
        router.push("/admin/manage-books")
      }, 1500)
    } catch (err) {
      toast({ title: "Error", description: "Failed to add book", variant: "destructive" })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div className="flex items-center ml-4">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Add New Book</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
            <CardDescription>Add a new book to the BookReview Hub library for users to review.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Book Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter the book title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="author" className="text-base font-medium">
                  Author *
                </Label>
                <Input
                  id="author"
                  type="text"
                  placeholder="Enter the author's name"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor="summary" className="text-base font-medium">
                  Summary/Description *
                </Label>
                <Textarea
                  id="summary"
                  placeholder="Enter a brief summary or description of the book..."
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  rows={6}
                  className="resize-none text-base"
                />
                <p className="text-sm text-gray-500">{formData.summary.length}/500 characters</p>
              </div>

              {/* Cover Image URL (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="coverImage" className="text-base font-medium">
                  Cover Image URL (Optional)
                </Label>
                <Input
                  id="coverImage"
                  type="url"
                  placeholder="https://example.com/book-cover.jpg"
                  value={formData.coverImage}
                  onChange={(e) => handleInputChange("coverImage", e.target.value)}
                  className="text-base"
                />
                <p className="text-sm text-gray-500">
                  Provide a URL to the book's cover image. If left empty, a default placeholder will be used.
                </p>
              </div>

              {/* Preview */}
              {(formData.title || formData.author || formData.summary) && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Preview</h3>
                  <Card className="max-w-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{formData.title || "Book Title"}</CardTitle>
                          <CardDescription className="text-sm font-medium text-gray-600">
                            by {formData.author || "Author Name"}
                          </CardDescription>
                        </div>
                        <div className="w-16 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0 ml-4">
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {formData.summary || "Book summary will appear here..."}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1">
                  Add Book to Library
                </Button>
                <Link href="/admin/manage-books">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
