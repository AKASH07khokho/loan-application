import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'

// Import your pages
import LoanForm from './pages/LoanForm'
import Dashboard from './pages/Dashboard'

// ---------------- Register Page ----------------
function Register({ onRegister }) {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const API_URL = "http://127.0.0.1:5000"

  const registerUser = async () => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Registration failed")
        return
      }

      alert("Registration successful!")
      onRegister()
      navigate("/login") // step 2: go to login
    } catch (err) {
      console.error(err)
      alert("Server error. Try again later.")
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      alert("Please fill in all fields")
      return
    }
    registerUser()
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded"/>
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded"/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded"/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Register</button>
      </form>
      <p className="mt-4 text-center">
        Already registered? <Link to="/login" className="text-blue-600 underline">Login here</Link>
      </p>
    </div>
  )
}

// ---------------- Login Page ----------------
function Login({ onLogin, setUser }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const API_URL = "http://127.0.0.1:5000"

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Login failed")
        return
      }

      alert(`Welcome back, ${data.name}!`)
      const loggedUser = { id: data.user_id, name: data.name }
      setUser(loggedUser)
      onLogin(loggedUser)
      navigate("/loan") // step 3: go to loan form
    } catch (err) {
      console.error(err)
      alert("Server error. Try again later.")
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded"/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded"/>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">Login</button>
      </form>
      <p className="mt-4 text-center">
        Don’t have an account? <Link to="/register" className="text-blue-600 underline">Register here</Link>
      </p>
    </div>
  )
}



// ---------------- App Component ----------------
export default function App() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const loggedIn = localStorage.getItem("loggedIn") === "true"
    if (storedUser) setIsRegistered(true)
    if (loggedIn && storedUser) {
      setUser(JSON.parse(storedUser))
      setIsLoggedIn(true)
    }
  }, [])

  const handleRegister = () => setIsRegistered(true)
  const handleLogin = (loggedUser) => {
    setIsLoggedIn(true)
    setUser(loggedUser)
    localStorage.setItem("loggedIn", "true")
    localStorage.setItem("user", JSON.stringify(loggedUser))
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Step 1: Register */}
        <Route path="/register" element={<Register onRegister={handleRegister} />} />

        {/* Step 2: Login (only if registered) */}
        <Route path="/login" element={isRegistered ? <Login onLogin={handleLogin} setUser={setUser} /> : <Navigate to="/register" />} />

        {/* Step 3: Loan Form (only if logged in) */}
        <Route path="/loan" element={isLoggedIn && user ? <LoanForm user={user} /> : <Navigate to="/login" />} />

        {/* Step 4: Dashboard (only if logged in) */}
        <Route path="/dashboard" element={isLoggedIn && user ? <Dashboard user={user} /> : <Navigate to="/login" />} />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </BrowserRouter>
  )
}
