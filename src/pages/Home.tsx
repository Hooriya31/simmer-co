import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchRecipes, getByCategory, getByArea, getCategories, getAreas, getRandomRecipes, mealImg } from '../lib/mealdb'
import FavoriteButton from '../components/FavoriteButton'
import { SearchIcon } from '../components/icons'
import type { Recipe } from '../lib/types'

interface Category {
  strCategory: string
  strCategoryThumb: string
}
interface Area {
  strArea: string
}

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const area = searchParams.get('area') || ''
  const focusSearch = searchParams.get('focus') === '1'

  const [inputValue, setInputValue] = useState(q)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [featured, setFeatured] = useState<Recipe[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const isDefaultView = !q && !category && !area

  useEffect(() => {
    getCategories().then(setCategories)
    getAreas().then(setAreas)
  }, [])

  useEffect(() => {
    setInputValue(q)
  }, [q])

  useEffect(() => {
    if (focusSearch) inputRef.current?.focus()
  }, [focusSearch])

  useEffect(() => {
    if (isDefaultView) {
      getRandomRecipes(6).then(setFeatured)
    }
  }, [isDefaultView])

  useEffect(() => {
    let ignore = false

    async function load() {
      if (isDefaultView) {
        setLoading(false)
        return
      }
      setLoading(true)
      let data: Recipe[] = []

      if (q) {
        data = await searchRecipes(q)
      } else if (category) {
        data = (await getByCategory(category)).slice(0, 16)
      } else if (area) {
        data = (await getByArea(area)).slice(0, 16)
      }

      if (!ignore) {
        setRecipes(data)
        setLoading(false)
      }
    }

    load()
    return () => { ignore = true }
  }, [q, category, area, isDefaultView])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!inputValue.trim()) return
    setSearchParams({ q: inputValue })
  }

  function handleCategoryClick(catName: string) {
    setSearchParams({ category: catName })
  }

  function handleAreaClick(areaName: string) {
    setSearchParams({ area: areaName })
  }

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

      <div className="hero-banner">
        <div className="hero-banner-content">
          <p className="hero-eyebrow">Welcome to</p>
          <h1>Simmer & Co.</h1>
          <p className="hero-tagline">Your next favorite dish is just a recipe away.</p>
        </div>
      </div>

      <h3 className="section-label">Discover by Category</h3>
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

      <h3 className="section-label">Discover by Cuisine</h3>
      <div className="cuisine-scroll">
        {areas.map((a) => (
          <button
            key={a.strArea}
            className={`cuisine-chip ${area === a.strArea ? 'active' : ''}`}
            onClick={() => handleAreaClick(a.strArea)}
          >
            {a.strArea}
          </button>
        ))}
      </div>

      {isDefaultView ? (
        <>
          <h3 className="section-label">Featured Recipes</h3>
          <div className="recipe-grid">
            {featured.map((recipe) => (
              <div key={recipe.idMeal} className="recipe-card">
                <Link to={`/recipe/${recipe.idMeal}`}>
                  <div className="img-wrap">
                    <img src={mealImg(recipe.strMealThumb, 'medium')} alt={recipe.strMeal} />
                    <span className="card-tag">Featured</span>
                  </div>
                  <div className="card-body">
                    <h3>{recipe.strMeal}</h3>
                  </div>
                </Link>
                <FavoriteButton recipe={recipe} />
              </div>
            ))}
          </div>
        </>
      ) : loading ? (
        <p>Loading...</p>
      ) : recipes.length === 0 ? (
        <p>No recipes found.Try a different search.</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.idMeal} className="recipe-card">
              <Link to={`/recipe/${recipe.idMeal}`}>
                <div className="img-wrap">
                  <img src={mealImg(recipe.strMealThumb, 'medium')} alt={recipe.strMeal} />
                  {(recipe.strCategory || category || area) && (
                    <span className="card-tag">{recipe.strCategory || category || area}</span>
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
    </div>
  )
}

export default Home