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
        const requests = Array.from({ length: 4 }, () =>
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

     {isDefaultView && (
  <div className="home-hero-wrap">
    <div className="hero-banner">
      <div className="hero-banner-content">
        <p className="hero-eyebrow">Welcome to</p>
        <h1>Simmer & Co.</h1>
        <p className="hero-tagline">Recipes worth cooking for. Find your next favorite dish.</p>
      </div>
    </div>

    {!loading && (
      <div className="hero-side-row">
        {recipes.slice(0, 2).map((recipe) => (
          <Link key={recipe.idMeal} to={`/recipe/${recipe.idMeal}`}>
            <div className="hero-side-card" style={{ backgroundImage: `url(${recipe.strMealThumb})` }}>
              <div className="hero-content">
                <h3>{recipe.strMeal}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}

    {categories.length > 0 && (
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
  </div>
)}

      {!isDefaultView && (
        <>
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

          {loading ? (
            <p>Loading...</p>
          ) : recipes.length === 0 ? (
            <p>No recipes found.Try a different search.</p>
          ) : (
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <div key={recipe.idMeal} className="recipe-card">
                  <Link to={`/recipe/${recipe.idMeal}`}>
                    <div className="img-wrap">
                      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                      {(recipe.strCategory || category) && (
                        <span className="card-tag">{recipe.strCategory || category}</span>
                      )}
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
        </>
      )}
    </div>
  )
}

export default Home