"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowLeft, Search, Star, Calendar, Trash2, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getBooks, listAllReviews, deleteReview as apiDeleteReview, Book, Review } from "@/lib/api"


interface User {
  email: string
  name: string
  isAdmin: boolean
  token: string
}

export default function AdminReviewsPage() {
  const [user, setUser] = useState<any | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBook, setSelectedBook] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
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

    getBooks()
      .then(setBooks)
      .catch(() => setBooks([]))

    listAllReviews(parsedUser.token)
      .then((all) => {
        setReviews(all)
        setFilteredReviews(all)
      })
      .catch(() => {
        setReviews([])
        setFilteredReviews([])
      })
  }, [router])

  useEffect(() => {
    let filtered = [...reviews]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by book
    if (selectedBook !== "all") {
      filtered = filtered.filter((review) => review.book_id === Number(selectedBook))
    }

    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case "oldest":
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        default:
          return 0
      }
    })

    setFilteredReviews(filtered)
  }, [reviews, searchTerm, selectedBook, sortBy])

  const handleDeleteReview = async (reviewId: number, userName: string) => {
    if (!confirm(`Are you sure you want to delete the review by ${userName}?`)) {
      return
    }

    try {
      await apiDeleteReview(reviewId, user!.token)
      setReviews(reviews.filter((review) => review.id !== reviewId))
      setFilteredReviews((prev) => prev.filter((r) => r.id !== reviewId))
      toast({ title: "Review Deleted", description: `Review by ${userName} has been deleted.` })
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete review", variant: "destructive" })
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  const getBookTitle = (bookId: number) => {
    const book = books.find((b) => b.id === bookId)
    return book ? book.title : "Unknown Book"
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div className="flex items-center ml-4">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Review Moderation</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Reviews</h1>
          <p className="text-gray-600">Monitor and moderate user reviews. Total: {reviews.length} reviews</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Book Filter */}
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by book" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Books</SelectItem>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Rating</SelectItem>
                  <SelectItem value="lowest">Lowest Rating</SelectItem>
                </SelectContent>
              </Select>

              {/* Results Count */}
              <div className="flex items-center justify-center">
                <Badge variant="secondary" className="text-sm">
                  {filteredReviews.length} result{filteredReviews.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedBook !== "all" ? "No reviews found" : "No reviews yet"}
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedBook !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Reviews will appear here as users submit them"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{review.userName}</h3>
                        <p className="text-sm text-gray-600">
                          Review for: <span className="font-medium">{getBookTitle(review.book_id)}</span>
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">{review.rating} out of 5 stars</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(review.timestamp)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                        onClick={() => handleDeleteReview(review.id, review.userName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
      </main>
    </div>
  )
}
