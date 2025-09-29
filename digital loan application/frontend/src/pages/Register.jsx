function Register({ onRegister }) {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // --- New: Register API call ---
  const registerUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // important
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()
      console.log("📥 API Response:", data)

      if (!response.ok) {
        alert(data.error || "Registration failed")
        return
      }

      alert("Registration successful!")
      onRegister()
      navigate("/login")
    } catch (err) {
      console.error(err)
      alert("Server error. Try again later.")
    }
  }

  // --- Updated form submit ---
  const handleRegister = (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      alert("Please fill in all fields")
      return
    }
    registerUser() // call API instead of localStorage
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
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
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Register
        </button>
      </form>

      <p className="mt-4 text-center">
        Already registered?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Login here
        </Link>
      </p>
    </div>
  )
}
