import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login({ onLogin, setUser }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const API_URL = "http://127.0.0.1:5000"

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      alert("Please enter email and password")
      return
    }

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

      // Save user info in React state
      const loggedUser = { id: data.user_id, name: data.name, email }
      setUser(loggedUser)

      // Call parent login handler
      onLogin(loggedUser)

      alert(`Welcome back, ${data.name}!`)
      navigate("/loan") // Redirect to loan form
    } catch (err) {
      console.error(err)
      alert("Server error. Try again later.")
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 underline">
          Register here
        </Link>
      </p>
    </div>
  )
}
