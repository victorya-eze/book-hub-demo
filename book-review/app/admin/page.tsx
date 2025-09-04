"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Plus, Eye, LogOut, Users, Star } from "lucide-react"
import Link from "next/link"

interface User {
  email: string
  name: string
  isAdmin: boolean
}

interface Book {
  id: string
  title: string
  author: string
  summary: string
}

interface Review {
  id: string
  bookId: string
  userId: string
  userName: string
  rating: number
  content: string
  timestamp: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const router = useRouter()

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

    // Load books and reviews
    const storedBooks = localStorage.getItem("books")
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks))
    }

    const storedReviews = localStorage.getItem("reviews")
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const totalReviews = reviews.length
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage books, view reviews, and oversee the BookReview Hub community.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{books.length}</div>
              <p className="text-xs text-muted-foreground">Books available for review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReviews}</div>
              <p className="text-xs text-muted-foreground">Reviews submitted by users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating > 0 ? averageRating.toFixed(1) : "0.0"}</div>
              <p className="text-xs text-muted-foreground">Out of 5 stars</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/add-book">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Add New Book</CardTitle>
                    <CardDescription>Add a new book to the library</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/manage-books">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Manage Books</CardTitle>
                    <CardDescription>View, edit, or delete existing books</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/reviews">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">View All Reviews</CardTitle>
                    <CardDescription>Monitor and moderate user reviews</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest reviews submitted by users</CardDescription>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {reviews
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 5)
                    .map((review) => {
                      const book = books.find((b) => b.id === review.bookId)
                      return (
                        <div key={review.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{review.userName}</span>
                              <span className="text-gray-500 text-xs">•</span>
                              <span className="text-gray-500 text-xs">{book?.title || "Unknown Book"}</span>
                              <div className="flex items-center">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{review.content}</p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(review.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      )
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
