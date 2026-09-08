const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

export async function searchRecipes(query: string) {
  const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`)
  const data = await res.json()
  return data.meals || []
}

export async function getRandomRecipes(count: number) {
  const requests = Array.from({ length: count }, () =>
    fetch(`${BASE_URL}/random.php`).then(res => res.json())
  )
  const results = await Promise.all(requests)
  return results.map(r => r.meals[0])
}

export async function getRecipeById(id: string) {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
  const data = await res.json()
  return data.meals?.[0] || null
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories.php`)
  const data = await res.json()
  return data.categories || []
}

export async function getByCategory(category: string) {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`)
  const data = await res.json()
  return data.meals || []
}

export async function getAreas() {
  const res = await fetch(`${BASE_URL}/list.php?a=list`)
  const data = await res.json()
  return data.meals || [] // TheMealDB nests area lists under "meals" too
}

export async function getByArea(area: string) {
  const res = await fetch(`${BASE_URL}/filter.php?a=${area}`)
  const data = await res.json()
  return data.meals || []
}

// TheMealDB image size variants: append /small, /medium, or /large
export function mealImg(url: string, size?: 'small' | 'medium' | 'large') {
  return size ? `${url}/${size}` : url
}

export function ingredientImg(name: string, size?: 'small') {
  const clean = encodeURIComponent(name.trim())
  return `https://www.themealdb.com/images/ingredients/${clean}${size ? '-small' : ''}.png`
}