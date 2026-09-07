import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Account() {
  const { user, deleteAccount, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  async function handleDelete() {
    const confirmed = window.confirm('This will permanently delete your account. Are you sure?')
    if (!confirmed) return
    try {
      await deleteAccount()
      navigate('/')
    } catch (err) {
      alert('Could not delete account. You may need to log in again first, then retry.')
    }
  }

  return (
    <div className="page auth-page">
      <h2>Account</h2>
      <p style={{ marginBottom: 20 }}>{user?.email}</p>
      <div className="account-actions">
        <button className="btn-account" onClick={handleLogout}>Log Out</button>
        <button className="btn-account btn-account-outline" onClick={handleDelete}>Delete Account</button>
      </div>
    </div>
  )
}

export default Account