"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, ArrowLeft, Plus, Trash2, Search, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getBooks, deleteBook as apiDeleteBook, listAllReviews, Book, Review } from "@/lib/api"

interface User {
  email: string
  name: string
  isAdmin: boolean
  token: string
}


export default function ManageBooksPage() {
  const [user, setUser] = useState<User | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [searchTerm, setSearchTerm] = useState("")
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
      .then(setReviews)
      .catch(() => setReviews([]))
  }, [router])

  const handleDeleteBook = async (bookId: number, bookTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${bookTitle}"? This will also delete all associated reviews.`)) {
      return
    }

    try {
      await apiDeleteBook(bookId, user!.token)
      setBooks(books.filter((b) => b.id !== bookId))
      setReviews(reviews.filter((r) => r.book_id !== bookId))
      toast({ title: "Book Deleted", description: `"${bookTitle}" has been deleted.` })
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete book", variant: "destructive" })
    }
  }

  const getBookReviewCount = (bookId: number) => {
    return reviews.filter((review) => review.book_id === bookId).length
  }

  const getBookAverageRating = (bookId: number) => {
    const bookReviews = reviews.filter((review) => review.book_id === bookId)
    if (bookReviews.length === 0) return 0
    return bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div className="flex items-center ml-4">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <span className="ml-2 text-lg font-semibold text-gray-900">Manage Books</span>
              </div>
            </div>
            <Link href="/admin/add-book">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Book
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Books</h1>
          <p className="text-gray-600">View, edit, or delete books in the library. Total: {books.length} books</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No books found" : "No books in library"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Start by adding your first book to the library"}
              </p>
              {!searchTerm && (
                <Link href="/admin/add-book">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Book
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const reviewCount = getBookReviewCount(book.id)
              const averageRating = getBookAverageRating(book.id)

              return (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{book.title}</CardTitle>
                        <CardDescription className="text-sm font-medium text-gray-600">
                          by {book.author}
                        </CardDescription>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>
                            {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                          </span>
                          {averageRating > 0 && <span>★ {averageRating.toFixed(1)}/5</span>}
                        </div>
                      </div>
                      <div className="w-16 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0 ml-4">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{book.description}</p>
                    <div className="flex gap-2">
                      <Link href={`/reviews/${book.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View Reviews
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                        onClick={() => handleDeleteBook(book.id, book.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
