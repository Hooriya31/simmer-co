import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchRecipes, getByCategory, getCategories } from '../lib/mealdb'
import FavoriteButton from '../components/FavoriteButton'
import { SearchIcon } from '../components/icons'
import type { Recipe } from '../lib/types'

interface Category {
  strCategory: string
  strCategoryThumb: string
}

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const focusSearch = searchParams.get('focus') === '1'

  const [inputValue, setInputValue] = useState(q)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    setInputValue(q)
  }, [q])

  useEffect(() => {
    if (focusSearch) inputRef.current?.focus()
  }, [focusSearch])

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      let data: Recipe[] = []

      if (q) {
        data = await searchRecipes(q)
      } else if (category) {
        data = (await getByCategory(category)).slice(0, 16)
      } else {
        const requests = Array.from({ length: 9 }, () =>
          fetch(`${BASE_URL}/random.php`).then(r => r.json())
        )
        const results = await Promise.all(requests)
        data = results.map(r => r.meals[0])
      }

      if (!ignore) {
        setRecipes(data)
        setLoading(false)
      }
    }

    load()
    return () => { ignore = true }
  }, [q, category])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!inputValue.trim()) return
    setSearchParams({ q: inputValue })
  }

  function handleCategoryClick(catName: string) {
    setSearchParams({ category: catName })
  }

  const isDefaultView = !q && !category
  const featuredMain = isDefaultView ? recipes[0] : null
  const featuredSide = isDefaultView ? recipes.slice(1, 3) : []
  const gridRecipes = isDefaultView ? recipes.slice(3) : recipes

  return (
    <div className="page">
      <form className="search-bar" onSubmit={handleSearch}>
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search recipes..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>

      {!loading && featuredMain && (
        <>
          <Link to={`/recipe/${featuredMain.idMeal}`}>
            <div className="hero-main" style={{ backgroundImage: `url(${featuredMain.strMealThumb})` }}>
              <div className="hero-content">
                <p className="hero-eyebrow">Featured Recipe</p>
                <h2>{featuredMain.strMeal}</h2>
                <span className="btn-get-recipe">Get Recipe</span>
              </div>
            </div>
          </Link>

          <div className="hero-side-row">
            {featuredSide.map((recipe) => (
              <Link key={recipe.idMeal} to={`/recipe/${recipe.idMeal}`}>
                <div className="hero-side-card" style={{ backgroundImage: `url(${recipe.strMealThumb})` }}>
                  <div className="hero-content">
                    <h3>{recipe.strMeal}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {isDefaultView && categories.length > 0 && (
        <>
          <h3 className="section-label">Discover by Category</h3>
          <div className="category-scroll">
            {categories.map((cat) => (
              <button key={cat.strCategory} className="category-circle" onClick={() => handleCategoryClick(cat.strCategory)}>
                <img src={cat.strCategoryThumb} alt={cat.strCategory} />
                <span>{cat.strCategory}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {!isDefaultView && (
        <div className="category-scroll">
          {categories.map((cat) => (
            <button
              key={cat.strCategory}
              className={`category-circle ${category === cat.strCategory ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.strCategory)}
            >
              <img src={cat.strCategoryThumb} alt={cat.strCategory} />
              <span>{cat.strCategory}</span>
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : gridRecipes.length === 0 ? (
        <p>No recipes found — try a different search.</p>
      ) : (
        <div className="recipe-grid">
          {gridRecipes.map((recipe) => (
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