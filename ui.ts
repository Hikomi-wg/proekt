import type { Recipe } from "./types.js";
// Задание 6
import { isValidHttpUrl } from "./recipes.js";

function requireElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Не найден элемент: ${selector}`);
  }
  return element;
}

export const searchInput = requireElement<HTMLInputElement>("#search");
export const categoryFilter = requireElement<HTMLSelectElement>("#category-filter");
export const favoritesOnly = requireElement<HTMLInputElement>("#favorites-only");

// Задание 1
export const sortSelect = requireElement<HTMLSelectElement>("#sort-time");

// Задание 2
export const quickOnly = requireElement<HTMLInputElement>("#quick-only");

// Задание 5
export const resetFiltersBtn = requireElement<HTMLButtonElement>("#reset-filters");

export const recipeForm = requireElement<HTMLFormElement>("#recipe-form");
export const formSubmitBtn = requireElement<HTMLButtonElement>("#recipe-form button[type='submit']");
export const recipeList = requireElement<HTMLDivElement>("#recipe-list");
export const formMessage = requireElement<HTMLParagraphElement>("#form-message");
export const resultsCount = requireElement<HTMLParagraphElement>("#results-count");

// Задание 6
export const imageInput = requireElement<HTMLInputElement>("#recipe-image");

// Задание 7
export const titleInput = requireElement<HTMLInputElement>("#recipe-title");
export const categoryInput = requireElement<HTMLSelectElement>("#recipe-category");
export const servingsInput = requireElement<HTMLInputElement>("#recipe-servings");
export const timeInput = requireElement<HTMLInputElement>("#recipe-time");
export const ingredientsInput = requireElement<HTMLTextAreaElement>("#recipe-ingredients");
export const instructionsInput = requireElement<HTMLTextAreaElement>("#recipe-instructions");

// Задание 3
export function updateCategoryFilterOptions(counts: Record<string, number>): void {
  for (const opt of categoryFilter.options) {
    if (!opt) continue;
    const count = counts[opt.value] ?? 0;
    if (opt.value === "Все") {
      opt.textContent = `Все категории (${count})`;
    } else {
      opt.textContent = `${opt.value} (${count})`;
    }
  }
}

export function renderRecipes(recipes: Recipe[]): void {
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

    // Задание 6
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

    // Задание 7
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

    // БЛОК ОТЗЫВОВ 
    const reviewsSection = document.createElement("div");
    reviewsSection.className = "reviews-section";

    // Доп. блок отзывов: Отображать количество отзывов 
    const reviewsHeader = document.createElement("p");
    reviewsHeader.className = "reviews-header";
    reviewsHeader.textContent = `Отзывы (${recipe.reviews.length}):`;
    reviewsSection.append(reviewsHeader);

    // Доп. блок отзывов: Отображать отзывы в карточке рецептов 
    if (recipe.reviews.length === 0) {
      const noReviews = document.createElement("p");
      noReviews.style.fontSize = "0.85em";
      noReviews.style.color = "#64748b";
      noReviews.textContent = "Пока нет отзывов. Оставьте первый!";
      reviewsSection.append(noReviews);
    } else {
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

        //Доп. блок отзывов: Кнопка отметки понравившегося отзыва 
        const likeBtn = document.createElement("button");
        likeBtn.type = "button";
        likeBtn.className = `review-like-btn ${rev.liked ? "liked" : ""}`;
        likeBtn.dataset.action = "like-review";
        likeBtn.dataset.recipeId = recipe.id;
        likeBtn.dataset.reviewId = rev.id;
        likeBtn.textContent = `${rev.liked ? "♥" : "♡"} ${rev.likes}`;

        // Доп. блок отзывов: Кнопка удаления отзыва 
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
    

    recipeList.append(card);
  }
}