export type Category = "Завтрак" | "Обед" | "Ужин" | "Десерт";
export type SortOrder = "none" | "asc" | "desc";
export interface Review {
    readonly id: string;
    author: string;
    text: string;
    likes: number;
    liked: boolean;
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
    imageUrl?: string;
    reviews: Review[];
}
export type RecipeDraft = Omit<Recipe, "id" | "favorite" | "reviews">;
export type RecipeFilter = {
    query: string;
    category: Category | "Все";
    favoritesOnly: boolean;
    quickOnly: boolean;
};
//# sourceMappingURL=types.d.ts.map