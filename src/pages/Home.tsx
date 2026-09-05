import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchRecipes, getRandomRecipes } from '../lib/mealdb'
import type { Recipe } from '../lib/types'

function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRandom()
  }, [])

  async function loadRandom() {
    setLoading(true)
    const data = await getRandomRecipes(8)
    setRecipes(data)
    setLoading(false)
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) {
      loadRandom()
      return
    }
    setLoading(true)
    const data = await searchRecipes(query)
    setRecipes(data)
    setLoading(false)
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {recipes.map((recipe) => (
            <Link key={recipe.idMeal} to={`/recipe/${recipe.idMeal}`}>
              <div>
                <img src={recipe.strMealThumb} alt={recipe.strMeal} width={200} />
                <p>{recipe.strMeal}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home