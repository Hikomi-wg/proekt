export function filterRecipes(recipes, filter) {
    const query = filter.query.trim().toLowerCase();
    return recipes.filter((recipe) => {
        const matchesQuery = recipe.title.toLowerCase().includes(query);
        const matchesCategory = filter.category === "Все" || recipe.category === filter.category;
        const matchesFavorite = !filter.favoritesOnly || recipe.favorite;
        // === Задание 2: Фильтр «до 30 минут» ===
        const matchesQuick = !filter.quickOnly || recipe.cookingTime <= 30;
        return matchesQuery && matchesCategory && matchesFavorite && matchesQuick;
    });
}
// === Задание 1: Функция сортировки по времени приготовления ===
export function sortRecipesByTime(recipes, order) {
    if (order === "none")
        return recipes;
    return [...recipes].sort((a, b) => order === "asc" ? a.cookingTime - b.cookingTime : b.cookingTime - a.cookingTime);
}
// === Задание 3: Подсчет рецептов по каждой категории ===
export function getCategoryCounts(recipes) {
    const counts = {
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
// === Задание 6: Функция валидации URL ссылки ===
export function isValidHttpUrl(str) {
    try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
    }
    catch {
        return false;
    }
}
export function createRecipe(draft) {
    return {
        ...draft,
        id: crypto.randomUUID(),
        favorite: false,
        // === Доп. блок отзывов: Инициализация массива отзывов ===
        reviews: []
    };
}
// === Задание 7: Редактирование рецепта с использованием Partial<RecipeDraft> ===
export function updateRecipe(recipes, id, changes) {
    return recipes.map((recipe) => recipe.id === id ? { ...recipe, ...changes } : recipe);
}
export function toggleFavorite(recipes, id) {
    return recipes.map((recipe) => recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe);
}
export function deleteRecipe(recipes, id) {
    return recipes.filter((recipe) => recipe.id !== id);
}
// === Доп. блок отзывов: Добавление нового отзыва ===
export function addReviewToRecipe(recipes, recipeId, author, text) {
    const newReview = {
        id: crypto.randomUUID(),
        author,
        text,
        likes: 0,
        liked: false
    };
    return recipes.map((recipe) => {
        if (recipe.id !== recipeId)
            return recipe;
        return {
            ...recipe,
            reviews: [...recipe.reviews, newReview]
        };
    });
}
// === Доп. блок отзывов: 3. Отметка понравившихся отзывов (лайк/анлайк) ===
export function toggleReviewLike(recipes, recipeId, reviewId) {
    return recipes.map((recipe) => {
        if (recipe.id !== recipeId)
            return recipe;
        return {
            ...recipe,
            reviews: recipe.reviews.map((rev) => {
                if (rev.id !== reviewId)
                    return rev;
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
// === Доп. блок отзывов: Удаление отзыва ===
export function deleteReviewFromRecipe(recipes, recipeId, reviewId) {
    return recipes.map((recipe) => {
        if (recipe.id !== recipeId)
            return recipe;
        return {
            ...recipe,
            reviews: recipe.reviews.filter((rev) => rev.id !== reviewId)
        };
    });
}
//# sourceMappingURL=recipes.js.map