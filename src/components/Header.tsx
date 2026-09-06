import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HomeIcon, SearchIcon, HeartIcon, UserIcon } from './icons'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <>
      <header className="site-header">
        <Link to="/" className="logo">🍲 Simmer & Co.</Link>
        <nav>
          <Link to="/favorites" className="desktop-only">Favorites</Link>
          {user ? (
            <>
              <Link to="/account" className="desktop-only">{user.email}</Link>
              <button onClick={handleLogout} className="desktop-only">Log Out</button>
            </>
          ) : (
            <Link to="/login" className="desktop-only">Login</Link>
          )}
        </nav>
      </header>

      <nav className="bottom-nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <HomeIcon /><span>Home</span>
        </Link>
        <Link to="/" className={location.pathname === '/search' ? 'active' : ''}>
          <SearchIcon /><span>Search</span>
        </Link>
        <Link to="/favorites" className={location.pathname === '/favorites' ? 'active' : ''}>
          <HeartIcon filled={location.pathname === '/favorites'} /><span>Favorites</span>
        </Link>
        <Link to={user ? '/account' : '/login'} className={location.pathname === '/account' ? 'active' : ''}>
          <UserIcon /><span>{user ? 'Account' : 'Login'}</span>
        </Link>
      </nav>
    </>
  )
}

export default Header