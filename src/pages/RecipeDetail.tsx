import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRecipeById } from '../lib/mealdb'
import FavoriteButton from '../components/FavoriteButton'
import { getIngredients } from '../lib/types'
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
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail