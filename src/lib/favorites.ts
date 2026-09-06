import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from './firebase'
import type { Recipe } from './types'

function favId(uid: string, recipeId: string) {
  return `${uid}_${recipeId}`
}

export async function addFavorite(uid: string, recipe: Recipe) {
  const ref = doc(db, 'favorites', favId(uid, recipe.idMeal))
  await setDoc(ref, {
    uid,
    recipeId: recipe.idMeal,
    strMeal: recipe.strMeal,
    strMealThumb: recipe.strMealThumb,
  })
}

export async function removeFavorite(uid: string, recipeId: string) {
  await deleteDoc(doc(db, 'favorites', favId(uid, recipeId)))
}

export function subscribeFavorites(uid: string, callback: (favs: any[]) => void) {
  const q = query(collection(db, 'favorites'), where('uid', '==', uid))
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(d => d.data())))
}