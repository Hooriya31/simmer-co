import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { user, logout, resendVerification } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header>
      <Link to="/"><h1>Simmer & Co.</h1></Link>
      <nav>
        <Link to="/favorites">Favorites</Link>
        {user ? (
          <>
            <span>{user.email}</span>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      {user && !user.emailVerified && (
        <div>
          <p>Please verify your email. <button onClick={() => resendVerification()}>Resend verification email</button></p>
        </div>
      )}
    </header>
  )
}

export default Header