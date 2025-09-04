"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Star, ArrowLeft, PenTool, Calendar } from "lucide-react"
import Link from "next/link"
import { getBooks, getReviews as fetchReviews, Book, Review } from "@/lib/api"


interface User {
  id: number
  email: string
  name: string
  isAdmin: boolean
  token: string
}

export default function ReviewsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [book, setBook] = useState<any | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const router = useRouter()
  const params = useParams()
  const bookId = params.bookId as string

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    getBooks()
      .then((books) => {
        const foundBook = books.find((b) => b.id === Number(bookId))
        setBook(foundBook || null)
      })
      .catch(() => setBook(null))

    fetchReviews(Number(bookId))
      .then(setReviews)
      .catch(() => setReviews([]))
  }, [router, bookId])

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  if (!user || !book) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center ml-4">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <span className="ml-2 text-lg font-semibold text-gray-900">Book Reviews</span>
              </div>
            </div>
            <Link href={`/review/${bookId}`}>
              <Button>
                <PenTool className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Book Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="w-full h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center mb-4">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
                <CardTitle className="text-xl">{book.title}</CardTitle>
                <CardDescription className="text-base font-medium">by {book.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{book.description}</p>

                {/* Rating Summary */}
                {reviews.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Average Rating</span>
                      <Badge variant="secondary">{averageRating.toFixed(1)} / 5</Badge>
                    </div>
                    {renderStars(Math.round(averageRating))}
                    <p className="text-xs text-gray-500 mt-1">
                      Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Reviews for "{book.title}"</h1>
              <p className="text-gray-600">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""} • Sorted by newest first
              </p>
            </div>

            {reviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to share your thoughts about this book!</p>
                  <Link href={`/review/${bookId}`}>
                    <Button>
                      <PenTool className="h-4 w-4 mr-2" />
                      Write the First Review
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{review.userName}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-500">{review.rating} out of 5 stars</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(review.timestamp)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{review.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
