import React, { useState } from 'react'

export default function LoanForm({ user }) {
  const [form, setForm] = useState({
    full_name: '',
    date_of_birth: '',
    employment: '',
    loan_amount: '',
    loan_type: ''
  })
  const API_URL = "http://127.0.0.1:5000"

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/loan_applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, ...form }),
      })
      const data = await response.json()
      if (!response.ok) {
        alert(data.error || "Loan application failed")
        return
      }
      alert(data.message)
    } catch (err) {
      console.error(err)
      alert("Server error. Try again later.")
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Loan Application</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} className="w-full p-2 border rounded"/>
        <input type="date" placeholder="Date of Birth" value={form.date_of_birth} onChange={(e) => setForm({...form, date_of_birth: e.target.value})} className="w-full p-2 border rounded"/>
        <input type="text" placeholder="Employment" value={form.employment} onChange={(e) => setForm({...form, employment: e.target.value})} className="w-full p-2 border rounded"/>
        <input type="number" placeholder="Loan Amount" value={form.loan_amount} onChange={(e) => setForm({...form, loan_amount: e.target.value})} className="w-full p-2 border rounded"/>
        <input type="text" placeholder="Loan Type" value={form.loan_type} onChange={(e) => setForm({...form, loan_type: e.target.value})} className="w-full p-2 border rounded"/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Apply Loan</button>
      </form>
    </div>
  )
}
