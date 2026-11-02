// === Задание 6: Импорт валидатора URL ===
import { isValidHttpUrl } from "./recipes.js";
function requireElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Не найден элемент: ${selector}`);
    }
    return element;
}
export const searchInput = requireElement("#search");
export const categoryFilter = requireElement("#category-filter");
export const favoritesOnly = requireElement("#favorites-only");
// === Задание 1: Элемент селекта сортировки ===
export const sortSelect = requireElement("#sort-time");
// === Задание 2: Элемент чекбокса «до 30 минут» ===
export const quickOnly = requireElement("#quick-only");
// === Задание 5: Кнопка очистки фильтров ===
export const resetFiltersBtn = requireElement("#reset-filters");
export const recipeForm = requireElement("#recipe-form");
export const formSubmitBtn = requireElement("#recipe-form button[type='submit']");
export const recipeList = requireElement("#recipe-list");
export const formMessage = requireElement("#form-message");
export const resultsCount = requireElement("#results-count");
// === Задание 6: Поле ссылки на изображение ===
export const imageInput = requireElement("#recipe-image");
// === Задание 7: Экспорт инпутов для заполнения при редактировании ===
export const titleInput = requireElement("#recipe-title");
export const categoryInput = requireElement("#recipe-category");
export const savingsInput = requireElement("#recipe-servings");
export const timeInput = requireElement("#recipe-time");
export const ingredientsInput = requireElement("#recipe-ingredients");
export const instructionsInput = requireElement("#recipe-instructions");
// === Задание 3: Функция обновления опций с количеством рецептов ===
export function updateCategoryFilterOptions(counts) {
    for (const opt of categoryFilter.options) {
        if (!opt)
            continue;
        const count = counts[opt.value] ?? 0;
        if (opt.value === "Все") {
            opt.textContent = `Все категории (${count})`;
        }
        else {
            opt.textContent = `${opt.value} (${count})`;
        }
    }
}
export function renderRecipes(recipes) {
    recipeList.replaceChildren();
    resultsCount.textContent = `Найдено рецептов: ${recipes.length}`;
    if (recipes.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "Ничего не найдено. Измените фильтр.";
        recipeList.append(empty);
        return;
    }
    for (const recipe of recipes) {
        const card = document.createElement("article");
        card.className = "recipe-card";
        // === Задание 6: Отображение фото при валидном URL ===
        if (recipe.imageUrl && isValidHttpUrl(recipe.imageUrl)) {
            const img = document.createElement("img");
            img.src = recipe.imageUrl;
            img.alt = recipe.title;
            card.append(img);
        }
        const title = document.createElement("h3");
        title.textContent = recipe.title;
        const meta = document.createElement("p");
        meta.textContent = `${recipe.category} • ${recipe.cookingTime} мин. • ${recipe.servings} порц.`;
        const ingredients = document.createElement("p");
        ingredients.textContent = `Ингредиенты: ${recipe.ingredients.join(", ")}`;
        const instructions = document.createElement("p");
        instructions.textContent = recipe.instructions;
        const buttonsWrapper = document.createElement("div");
        const favoriteButton = document.createElement("button");
        favoriteButton.type = "button";
        favoriteButton.dataset.action = "favorite";
        favoriteButton.dataset.id = recipe.id;
        favoriteButton.textContent = recipe.favorite ? "★ Убрать из избранного" : "☆ В избранное";
        // === Задание 7: Кнопка «Редактировать» ===
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.dataset.action = "edit";
        editButton.dataset.id = recipe.id;
        editButton.textContent = "Редактировать";
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = recipe.id;
        deleteButton.textContent = "Удалить";
        buttonsWrapper.append(favoriteButton, editButton, deleteButton);
        card.append(title, meta, ingredients, instructions, buttonsWrapper);
        // ==================== БЛОК ОТЗЫВОВ ====================
        const reviewsSection = document.createElement("div");
        reviewsSection.className = "reviews-section";
        // === Доп. блок отзывов: 2.2. Отображать количество отзывов ===
        const reviewsHeader = document.createElement("p");
        reviewsHeader.className = "reviews-header";
        reviewsHeader.textContent = `Отзывы (${recipe.reviews.length}):`;
        reviewsSection.append(reviewsHeader);
        // === Доп. блок отзывов: 2.1. Отображать отзывы в карточке рецептов ===
        if (recipe.reviews.length === 0) {
            const noReviews = document.createElement("p");
            noReviews.style.fontSize = "0.85em";
            noReviews.style.color = "#64748b";
            noReviews.textContent = "Пока нет отзывов. Оставьте первый!";
            reviewsSection.append(noReviews);
        }
        else {
            for (const rev of recipe.reviews) {
                const revItem = document.createElement("div");
                revItem.className = "review-item";
                const revAuthor = document.createElement("div");
                revAuthor.className = "review-author";
                revAuthor.textContent = rev.author;
                const revText = document.createElement("div");
                revText.className = "review-text";
                revText.textContent = rev.text;
                const revControls = document.createElement("div");
                // === Доп. блок отзывов: 3. Кнопка отметки понравившегося отзыва ===
                const likeBtn = document.createElement("button");
                likeBtn.type = "button";
                likeBtn.className = `review-like-btn ${rev.liked ? "liked" : ""}`;
                likeBtn.dataset.action = "like-review";
                likeBtn.dataset.recipeId = recipe.id;
                likeBtn.dataset.reviewId = rev.id;
                likeBtn.textContent = `${rev.liked ? "♥" : "♡"} ${rev.likes}`;
                // === Доп. блок отзывов: Кнопка удаления отзыва ===
                const deleteReviewBtn = document.createElement("button");
                deleteReviewBtn.type = "button";
                deleteReviewBtn.className = "review-delete-btn";
                deleteReviewBtn.dataset.action = "delete-review";
                deleteReviewBtn.dataset.recipeId = recipe.id;
                deleteReviewBtn.dataset.reviewId = rev.id;
                deleteReviewBtn.textContent = "Удалить отзыв";
                revControls.append(likeBtn, deleteReviewBtn);
                revItem.append(revAuthor, revText, revControls);
                reviewsSection.append(revItem);
            }
        }
        // Форма добавления отзыва
        const reviewForm = document.createElement("form");
        reviewForm.className = "review-form";
        reviewForm.dataset.recipeId = recipe.id;
        const authorInput = document.createElement("input");
        authorInput.type = "text";
        authorInput.placeholder = "Ваше имя";
        authorInput.required = true;
        authorInput.name = "reviewAuthor";
        const textInput = document.createElement("textarea");
        textInput.placeholder = "Напишите отзыв...";
        textInput.required = true;
        textInput.rows = 2;
        textInput.name = "reviewText";
        const submitReviewBtn = document.createElement("button");
        submitReviewBtn.type = "submit";
        submitReviewBtn.textContent = "Оставить отзыв";
        reviewForm.append(authorInput, textInput, submitReviewBtn);
        reviewsSection.append(reviewForm);
        card.append(reviewsSection);
        // =======================================================
        recipeList.append(card);
    }
}
//# sourceMappingURL=ui.js.map