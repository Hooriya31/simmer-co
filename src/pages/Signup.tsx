import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await signup(email, password)
      setDone(true)
    } catch (err) {
      setError('Could not create account. ' + (err instanceof Error ? err.message : ''))
    }
  }

  if (done) {
    return (
      <div className="page auth-page">
        <h2>Check your email</h2>
        <p>We sent a verification link to {email}. Verify it, then log in.</p>
        <button onClick={() => navigate('/login')} style={{ marginTop: 16 }}>Go to Login</button>
      </div>
    )
  }

  return (
    <div className="page auth-page">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'var(--paprika)' }}>{error}</p>}
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  )
}

export default Signup