import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addFavorite, removeFavorite, subscribeFavorites } from '../lib/favorites'
import { HeartIcon } from './icons'
import type { Recipe } from '../lib/types'

function FavoriteButton({ recipe }: { recipe: Recipe }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    if (!user) return
    const unsub = subscribeFavorites(user.uid, (favs) => {
      setIsFav(favs.some(f => f.recipeId === recipe.idMeal))
    })
    return unsub
  }, [user, recipe.idMeal])

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } })
      return
    }
    if (isFav) {
      await removeFavorite(user.uid, recipe.idMeal)
    } else {
      await addFavorite(user.uid, recipe)
    }
  }

  return (
    <button className="fav-btn" onClick={handleClick} aria-label="Favorite">
      <HeartIcon filled={isFav} />
    </button>
  )
}

export default FavoriteButton