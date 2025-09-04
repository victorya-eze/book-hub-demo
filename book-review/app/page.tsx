import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Star, Users, PenTool } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">BookReview Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Your Next
            <span className="text-indigo-600"> Great Read</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of book lovers sharing honest reviews, discovering new authors, and building a community
            around the books we love.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 py-3">
                Register Now
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                Login
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate & Review</h3>
              <p className="text-gray-600">Share your thoughts and rate books from 1 to 5 stars</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">Connect with fellow readers and discover new perspectives</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <PenTool className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Write Reviews</h3>
              <p className="text-gray-600">Express your thoughts with detailed, helpful reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
