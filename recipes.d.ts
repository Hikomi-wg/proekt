import type { Recipe, RecipeDraft, RecipeFilter, SortOrder } from "./types.js";
export declare function filterRecipes(recipes: Recipe[], filter: RecipeFilter): Recipe[];
export declare function sortRecipesByTime(recipes: Recipe[], order: SortOrder): Recipe[];
export declare function getCategoryCounts(recipes: Recipe[]): Record<string, number>;
export declare function isValidHttpUrl(str: string): boolean;
export declare function createRecipe(draft: RecipeDraft): Recipe;
export declare function updateRecipe(recipes: Recipe[], id: string, changes: Partial<RecipeDraft>): Recipe[];
export declare function toggleFavorite(recipes: Recipe[], id: string): Recipe[];
export declare function deleteRecipe(recipes: Recipe[], id: string): Recipe[];
export declare function addReviewToRecipe(recipes: Recipe[], recipeId: string, author: string, text: string): Recipe[];
export declare function toggleReviewLike(recipes: Recipe[], recipeId: string, reviewId: string): Recipe[];
export declare function deleteReviewFromRecipe(recipes: Recipe[], recipeId: string, reviewId: string): Recipe[];
//# sourceMappingURL=recipes.d.ts.map