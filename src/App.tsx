import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Account from './pages/Account'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </>
  )
}

export default App