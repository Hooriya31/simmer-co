import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRecipeById } from '../lib/mealdb'
import FavoriteButton from '../components/FavoriteButton'
import { getIngredients } from '../lib/types'
import { PlayIcon } from '../components/icons'
import type { Recipe } from '../lib/types'

function RecipeDetail() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) loadRecipe(id)
  }, [id])

  async function loadRecipe(recipeId: string) {
    setLoading(true)
    const data = await getRecipeById(recipeId)
    setRecipe(data)
    setLoading(false)
  }

  if (loading) return <p className="page">Loading...</p>
  if (!recipe) return <p className="page">Recipe not found.</p>

  const ingredients = getIngredients(recipe)
  const tags = recipe.strTags ? recipe.strTags.split(',').filter(Boolean) : []

  return (
    <div className="page">
      <div className="recipe-detail-grid">
        <div className="recipe-detail-image">
          <img src={recipe.strMealThumb} alt={recipe.strMeal} />
        </div>
        <div className="recipe-detail-content">
          <h1>{recipe.strMeal}</h1>
          <div className="recipe-meta">
            <span>{recipe.strCategory} • {recipe.strArea}</span>
            <FavoriteButton recipe={recipe} />
          </div>

          {recipe.strYoutube && (
            <a className="btn-watch" href={recipe.strYoutube} target="_blank" rel="noopener noreferrer">
              <PlayIcon /> Watch Video
            </a>
          )}

          {tags.length > 0 && (
            <div className="tag-row">
              {tags.map((tag) => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>
          )}

          <h3 className="detail-section-label">Ingredients</h3>
          <ul className="ingredient-list">
            {ingredients.map((item, i) => (
              <li key={i}>
                <span className="ingredient-measure">{item.measure}</span> {item.ingredient}
              </li>
            ))}
          </ul>

          <h3 className="detail-section-label">Instructions</h3>
          <p className="recipe-instructions">{recipe.strInstructions}</p>

          {recipe.strSource && (
            <p className="source-link">
              <a href={recipe.strSource} target="_blank" rel="noopener noreferrer">View original source</a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail