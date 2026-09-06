export interface Recipe {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory?: string
  strArea?: string
  strInstructions?: string
  [key: string]: string | undefined
}

export function getIngredients(recipe: Recipe) {
  const ingredients: { ingredient: string; measure: string }[] = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]
    const measure = recipe[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure: measure?.trim() || '' })
    }
  }
  return ingredients
}