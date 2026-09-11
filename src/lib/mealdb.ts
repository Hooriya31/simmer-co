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

const POPULATED_AREAS = [
  'American', 'British', 'Canadian', 'Chinese', 'Croatian', 'Dutch',
  'Egyptian', 'Filipino', 'French', 'Greek', 'Indian', 'Irish',
  'Italian', 'Jamaican', 'Japanese', 'Kenyan', 'Malaysian', 'Mexican',
  'Moroccan', 'Polish', 'Portuguese', 'Russian', 'Spanish', 'Thai',
  'Tunisian', 'Turkish', 'Ukrainian', 'Vietnamese'
]

const CACHE_KEY = 'simmer-co-areas-cache'

export async function getAreas() {
  const cached = localStorage.getItem(CACHE_KEY)
  const verified = cached ? JSON.parse(cached).data : POPULATED_AREAS.map((strArea) => ({ strArea }))

  // Revalidate in the background ,doesn't block the return, updates cache for next visit
  revalidateAreas()

  return verified
}

async function revalidateAreas() {
  try {
    const results: { strArea: string }[] = []
    const batchSize = 4

    for (let i = 0; i < POPULATED_AREAS.length; i += batchSize) {
      const batch = POPULATED_AREAS.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(async (name) => {
          try {
            const r = await fetch(`${BASE_URL}/filter.php?a=${name}`)
            const d = await r.json()
            return (d.meals?.length || 0) > 0 ? { strArea: name } : null
          } catch {
            return { strArea: name } // network hiccup ,keep it, don't punish for a fluke
          }
        })
      )
      results.push(...batchResults.filter((r): r is { strArea: string } => r !== null))
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: results, timestamp: Date.now() }))
  } catch {
    // the hardcoded list is already showing, no need to alarm the user
  }
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