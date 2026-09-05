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