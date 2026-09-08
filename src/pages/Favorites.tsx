import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { subscribeFavorites, removeFavorite } from '../lib/favorites'

function Favorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    const unsub = subscribeFavorites(user.uid, setFavorites)
    return unsub
  }, [user])

  if (!user) {
    return (
      <div className="page">
        <p>You need to be logged in to see your favorites. <Link to="/login">Log in</Link></p>
      </div>
    )
  }

  return (
    <div className="page">
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>Your Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet, go find something delicious!</p>
      ) : (
        <div className="recipe-grid">
          {favorites.map((fav) => (
            <div key={fav.recipeId} className="recipe-card">
              <Link to={`/recipe/${fav.recipeId}`}>
                <div className="img-wrap">
                  <img src={fav.strMealThumb} alt={fav.strMeal} />
                </div>
                <div className="card-body">
                  <h3>{fav.strMeal}</h3>
                </div>
              </Link>
              <button className="fav-btn" onClick={() => removeFavorite(user.uid, fav.recipeId)}>♥</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites