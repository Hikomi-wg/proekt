// Доп. блок отзывов: Импорт 
import type { Recipe, Review } from "./types.js";

const STORAGE_KEY = "culinary-recipes";

// Доп. блок отзывов: Тайпгард валидации одного отзыва 
function isReview(value: unknown): value is Review {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.author === "string" &&
    typeof item.text === "string" &&
    typeof item.likes === "number" &&
    typeof item.liked === "boolean"
  );
}

function isRecipe(value: unknown): value is Recipe {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.category === "string" &&
    typeof item.servings === "number" &&
    typeof item.cookingTime === "number" &&
    Array.isArray(item.ingredients) &&
    item.ingredients.every((x: unknown) => typeof x === "string") &&
    typeof item.instructions === "string" &&
    typeof item.favorite === "boolean" &&
    // Задание 6
    (item.imageUrl === undefined || typeof item.imageUrl === "string") &&


    // Доп. блок отзывов - валидация массива отзывов
    (item.reviews === undefined || (Array.isArray(item.reviews) && item.reviews.every(isReview)))
  );
}

export function loadRecipes(): Recipe[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isRecipe)) {
      return null;
    }
    // Доп. блок отзывов: Защита старых сохранений без поля reviews
    return parsed.map((recipe) => ({
      ...recipe,
      reviews: recipe.reviews ?? []
    }));
  } catch {
    return null;
  }
}

export function saveRecipes(recipes: Recipe[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}