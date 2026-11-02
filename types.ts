export type Category =
  | "Завтрак"
  | "Обед"
  | "Ужин"
  | "Десерт";

// Задание 1
export type SortOrder = "none" | "asc" | "desc";

// ДОП Интерфейс отзыва Review 
export interface Review {
  readonly id: string;
  author: string;
  text: string;
  likes: number;     // ДОП - Количество лайков
  liked: boolean;    // ДОП - лайк
}

export interface Recipe {
  readonly id: string;
  title: string;
  category: Category;
  servings: number;
  cookingTime: number;
  ingredients: string[];
  instructions: string;
  favorite: boolean;
  // Задание 6
  imageUrl?: string;

  // ДОП Список отзывов в Recipe 
  reviews: Review[];
}

// Задание 7
export type RecipeDraft = Omit<Recipe, "id" | "favorite" | "reviews">;

export type RecipeFilter = {
  query: string;
  category: Category | "Все";
  favoritesOnly: boolean;
  // Задание 2
  quickOnly: boolean;
};