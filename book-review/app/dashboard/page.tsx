"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, PenTool, Eye, LogOut } from "lucide-react"
import Link from "next/link"
import { getBooks, Book } from "@/lib/api"

interface User {
  email: string
  name: string
  isAdmin: boolean
  token: string
}


export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    getBooks()
      .then(setBooks)
      .catch(() => setBooks([]))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">BookReview Hub</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Discover new books and share your thoughts with the community.</p>
        </div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{book.title}</CardTitle>
                    <CardDescription className="text-sm font-medium text-gray-600">by {book.author}</CardDescription>
                  </div>
                  <div className="w-16 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0 ml-4">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{book.description}</p>
                <div className="flex gap-2">
                  <Link href={`/review/${book.id}`} className="flex-1">
                    <Button className="w-full" size="sm">
                      <PenTool className="h-4 w-4 mr-2" />
                      Write Review
                    </Button>
                  </Link>
                  <Link href={`/reviews/${book.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Reviews
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books available</h3>
            <p className="text-gray-600">Check back later for new books to review!</p>
          </div>
        )}
      </main>
    </div>
  )
}
