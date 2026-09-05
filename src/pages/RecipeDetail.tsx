import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRecipeById } from '../lib/mealdb'
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

  if (loading) return <p>Loading...</p>
  if (!recipe) return <p>Recipe not found.</p>

  return (
    <div>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} width={300} />
      <h2>{recipe.strMeal}</h2>
      <p>{recipe.strCategory} • {recipe.strArea}</p>
      <p>{recipe.strInstructions}</p>
    </div>
  )
}

export default RecipeDetail