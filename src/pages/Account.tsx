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
      <button onClick={handleLogout} style={{ marginBottom: 10, padding: '10px 0', background: 'var(--herb)', color: '#fff', borderRadius: 50 }}>Log Out</button>
      <button onClick={handleDelete} style={{ padding: '10px 0', background: 'transparent', color: 'var(--paprika)', border: '1px solid var(--paprika)', borderRadius: 50 }}>Delete Account</button>
    </div>
  )
}

export default Account