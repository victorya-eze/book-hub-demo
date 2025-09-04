"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { BookOpen, Star, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getBooks, submitReview, Book } from "@/lib/api"

interface User {
  id: number
  email: string
  name: string
  isAdmin: boolean
  token: string
}


export default function ReviewPage() {
  const [user, setUser] = useState<User | null>(null)
  const [book, setBook] = useState<Book | null>(null)
  const [rating, setRating] = useState(0)
  const [reviewContent, setReviewContent] = useState("")
  const [hoveredStar, setHoveredStar] = useState(0)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
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
        const found = books.find((b) => b.id === Number(bookId))
        setBook(found || null)
      })
      .catch(() => setBook(null))
  }, [router, bookId])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rating || !reviewContent.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a rating and review content",
        variant: "destructive",
      })
      return
    }

    if (!user || !book) return

    try {
      await submitReview(Number(bookId), rating, reviewContent.trim(), user.token)
      toast({
        title: "Success!",
        description: "Your review has been submitted successfully.",
      })

      setRating(0)
      setReviewContent("")

      setTimeout(() => {
        router.push(`/reviews/${bookId}`)
      }, 1500)
    } catch (err) {
      toast({ title: "Error", description: "Failed to submit review", variant: "destructive" })
    }
  }

  if (!user || !book) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center ml-4">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Write Review</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Book Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="w-full h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center mb-4">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
                <CardTitle className="text-xl">{book.title}</CardTitle>
                <CardDescription className="text-base font-medium">by {book.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{book.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Thoughts</CardTitle>
                <CardDescription>Help other readers by sharing your honest review of this book.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  {/* Rating */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Rating</Label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="p-1 hover:scale-110 transition-transform"
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          onClick={() => setRating(star)}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoveredStar || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-sm text-gray-600">{rating > 0 && `${rating} out of 5 stars`}</span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-2">
                    <Label htmlFor="review-content" className="text-base font-medium">
                      Your Review
                    </Label>
                    <Textarea
                      id="review-content"
                      placeholder="Share your thoughts about this book... What did you like? What didn't work for you? Would you recommend it to others?"
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      rows={8}
                      className="resize-none"
                    />
                    <p className="text-sm text-gray-500">{reviewContent.length}/1000 characters</p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                      Submit Review
                    </Button>
                    <Link href={`/reviews/${bookId}`}>
                      <Button type="button" variant="outline">
                        View Existing Reviews
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
