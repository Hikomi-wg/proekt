//  Задание 1 и блок коментов
import type { Recipe, RecipeDraft, RecipeFilter, Review, SortOrder } from "./types.js";

export function filterRecipes(
  recipes: Recipe[],
  filter: RecipeFilter
): Recipe[] {
  const query = filter.query.trim().toLowerCase();
  return recipes.filter((recipe) => {
    const matchesQuery = recipe.title.toLowerCase().includes(query);
    const matchesCategory = filter.category === "Все" || recipe.category === filter.category;
    const matchesFavorite = !filter.favoritesOnly || recipe.favorite;
    // Задание 2:
    const matchesQuick = !filter.quickOnly || recipe.cookingTime <= 30;

    return matchesQuery && matchesCategory && matchesFavorite && matchesQuick;
  });
}

// Задание 1
export function sortRecipesByTime(recipes: Recipe[], order: SortOrder): Recipe[] {
  if (order === "none") return recipes;
  return [...recipes].sort((a, b) =>
    order === "asc" ? a.cookingTime - b.cookingTime : b.cookingTime - a.cookingTime
  );
}

// Задание 3
export function getCategoryCounts(recipes: Recipe[]): Record<string, number> {
  const counts: Record<string, number> = {
    "Все": recipes.length,
    "Завтрак": 0,
    "Обед": 0,
    "Ужин": 0,
    "Десерт": 0
  };

  for (const recipe of recipes) {
    const current = counts[recipe.category];
    if (typeof current === "number") {
      counts[recipe.category] = current + 1;
    }
  }

  return counts;
}

// Задание 6
export function isValidHttpUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function createRecipe(draft: RecipeDraft): Recipe {
  return {
    ...draft,
    id: crypto.randomUUID(),
    favorite: false,
    // Доп. блок отзывов: Инициализация массива отзывов 
    reviews: []
  };
}

// Задание 7
export function updateRecipe(
  recipes: Recipe[],
  id: string,
  changes: Partial<RecipeDraft>
): Recipe[] {
  return recipes.map((recipe) =>
    recipe.id === id ? { ...recipe, ...changes } : recipe
  );
}

export function toggleFavorite(recipes: Recipe[], id: string): Recipe[] {
  return recipes.map((recipe) =>
    recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe
  );
}

export function deleteRecipe(recipes: Recipe[], id: string): Recipe[] {
  return recipes.filter((recipe) => recipe.id !== id);
}

// Доп. блок отзывов: Добавление нового отзыва
export function addReviewToRecipe(
  recipes: Recipe[],
  recipeId: string,
  author: string,
  text: string
): Recipe[] {
  const newReview: Review = {
    id: crypto.randomUUID(),
    author,
    text,
    likes: 0,
    liked: false
  };

  return recipes.map((recipe) => {
    if (recipe.id !== recipeId) return recipe;
    return {
      ...recipe,
      reviews: [...recipe.reviews, newReview]
    };
  });
}

// Доп. блок отзывов:Отметка понравившихся отзывов 
export function toggleReviewLike(
  recipes: Recipe[],
  recipeId: string,
  reviewId: string
): Recipe[] {
  return recipes.map((recipe) => {
    if (recipe.id !== recipeId) return recipe;
    return {
      ...recipe,
      reviews: recipe.reviews.map((rev) => {
        if (rev.id !== reviewId) return rev;
        const newLiked = !rev.liked;
        return {
          ...rev,
          liked: newLiked,
          likes: newLiked ? rev.likes + 1 : rev.likes - 1
        };
      })
    };
  });
}

// Доп. блок отзывов: Удаление отзыва
export function deleteReviewFromRecipe(
  recipes: Recipe[],
  recipeId: string,
  reviewId: string
): Recipe[] {
  return recipes.map((recipe) => {
    if (recipe.id !== recipeId) return recipe;
    return {
      ...recipe,
      reviews: recipe.reviews.filter((rev) => rev.id !== reviewId)
    };
  });
}