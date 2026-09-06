import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchRecipes } from '../lib/mealdb'
import FavoriteButton from '../components/FavoriteButton'
import { SearchIcon } from '../components/icons'
import type { Recipe } from '../lib/types'

const CATEGORIES = [
  { name: 'Dessert', emoji: '🍰' },
  { name: 'Chicken', emoji: '🍗' },
  { name: 'Seafood', emoji: '🦐' },
  { name: 'Vegetarian', emoji: '🥗' },
  { name: 'Breakfast', emoji: '🍳' },
]

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Dessert')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadByCategory(activeCategory)
  }, [activeCategory])

  async function loadByCategory(category: string) {
    setLoading(true)
    const res = await fetch(`${BASE_URL}/filter.php?c=${category}`)
    const data = await res.json()
    setRecipes((data.meals || []).slice(0, 8))
    setLoading(false)
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    const data = await searchRecipes(query)
    setRecipes(data)
    setLoading(false)
  }

  const featured = recipes[0]

  return (
    <div className="page">
      <form className="search-bar" onSubmit={handleSearch}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {!loading && featured && (
        <Link to={`/recipe/${featured.idMeal}`}>
          <div className="hero-card" style={{ backgroundImage: `url(${featured.strMealThumb})` }}>
            <div className="hero-content">
              <p className="hero-eyebrow">Featured Recipe</p>
              <h2>{featured.strMeal}</h2>
            </div>
          </div>
        </Link>
      )}

      <div className="category-row">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            className={`category-chip ${activeCategory === cat.name ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.name)}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="recipe-grid">
          {recipes.slice(1).map((recipe) => (
            <div key={recipe.idMeal} className="recipe-card">
              <Link to={`/recipe/${recipe.idMeal}`}>
                <div className="img-wrap">
                  <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                </div>
                <div className="card-body">
                  <h3>{recipe.strMeal}</h3>
                </div>
              </Link>
              <FavoriteButton recipe={recipe} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home