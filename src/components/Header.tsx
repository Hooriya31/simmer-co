import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { user, logout } = useAuth()

  return (
    <header>
      <Link to="/"><h1>Simmer & Co.</h1></Link>
      <nav>
        <Link to="/favorites">Favorites</Link>
        {user ? (
          <>
            <span>{user.email}</span>
            <button onClick={logout}>Log Out</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  )
}

export default Header