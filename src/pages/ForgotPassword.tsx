import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const { resetPassword } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError('Could not send reset email. Check the address and try again.')
    }
  }

  if (sent) {
    return (
      <div>
        <h2>Check your email</h2>
        <p>We sent a password reset link to {email}.</p>
        <Link to="/login">Back to Login</Link>
      </div>
    )
  }

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {error && <p>{error}</p>}
      <p><Link to="/login">Back to Login</Link></p>
    </div>
  )
}

export default ForgotPassword