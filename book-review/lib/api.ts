const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface LoginResponse {
  token: string;
  user: { id: number; name: string; email: string; is_admin: boolean };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    throw new Error('Failed to login');
  }
  return res.json();
}

export async function register(name: string, email: string, password: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
  } catch {
    throw new Error('Unable to reach the server');
  }

  if (!res.ok) {
    throw new Error('Failed to register');
  }
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  summary?: string;
  image_url?: string;
}

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(`${API_URL}/books`);
  if (!res.ok) {
    throw new Error('Failed to load books');
  }
  return res.json();
}

export interface Review {
  id: number;
  book_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  content: string;
  timestamp: string;
}

export async function getReviews(bookId: number): Promise<Review[]> {
  const res = await fetch(`${API_URL}/reviews/${bookId}`);
  if (!res.ok) {
    throw new Error('Failed to load reviews');
  }
  return res.json();
}

export async function submitReview(bookId: number, rating: number, content: string, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ book_id: bookId, rating, content })
  });
  if (!res.ok) {
    throw new Error('Failed to submit review');
  }
}

export async function addBook(book: {title: string; author: string; description: string; image_url?: string}, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/admin/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(book)
  });
  if (!res.ok) {
    throw new Error('Failed to add book');
  }
}

export async function deleteBook(bookId: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/admin/books/${bookId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error('Failed to delete book');
  }
}

export async function listAllReviews(token: string): Promise<Review[]> {
  const res = await fetch(`${API_URL}/admin/reviews`, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!res.ok) {
    throw new Error('Failed to load reviews');
  }
  return res.json();
}
