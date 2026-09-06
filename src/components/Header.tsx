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
        <Link to="/" className="logo">
          <img src="/logo-header.png" alt="" /> Simmer & Co.
        </Link>
        <nav>
          <Link to="/favorites" className="nav-pill desktop-only">
            <HeartIcon filled={false} /> Favorites
          </Link>
          {user ? (
            <>
              <Link to="/account" className="nav-pill desktop-only">
                <UserIcon /> {user.email}
              </Link>
              <button onClick={handleLogout} className="nav-pill desktop-only nav-pill-outline">
                Log Out
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-pill nav-pill-solid desktop-only">
              <UserIcon /> Login
            </Link>
          )}
        </nav>
      </header>

      <nav className="bottom-nav">
        <Link to="/" className={location.pathname === '/' && !location.search ? 'active' : ''}>
          <HomeIcon /><span>Home</span>
        </Link>
        <Link to="/?focus=1" className={location.search.includes('focus') ? 'active' : ''}>
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