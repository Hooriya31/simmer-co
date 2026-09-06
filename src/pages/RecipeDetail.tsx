import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRecipeById } from '../lib/mealdb'
import FavoriteButton from '../components/FavoriteButton'
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

  return (
    <div className="page recipe-detail">
      <div className="recipe-detail-hero">
        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      </div>
      <h1>{recipe.strMeal}</h1>
      <div className="recipe-meta">
        <span>{recipe.strCategory} • {recipe.strArea}</span>
        <FavoriteButton recipe={recipe} />
      </div>
      <p className="recipe-instructions">{recipe.strInstructions}</p>
    </div>
  )
}

export default RecipeDetail