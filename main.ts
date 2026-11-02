// Задание 1:
import type { Category, Recipe, RecipeDraft, RecipeFilter, SortOrder } from "./types.js";
import { initialRecipes } from "./data.js";
import { loadRecipes, saveRecipes } from "./storage.js";
import {
  createRecipe,
  deleteRecipe,
  filterRecipes,
  toggleFavorite,
  // Задание 1
  sortRecipesByTime,
    // Задание 3
  getCategoryCounts,
  // Задание 7
  updateRecipe,

  // Доп. блок отзывов: Импорт функций отзывов
  addReviewToRecipe,
  toggleReviewLike,
  deleteReviewFromRecipe 
} from "./recipes.js";
import {
  searchInput,
  categoryFilter,
  favoritesOnly,
  recipeForm,
  recipeList,
  formMessage,
  resultsCount,
  renderRecipes,
  // Задание 1
  sortSelect,
   // Задание 2
  quickOnly,
  // Задание 5
  resetFiltersBtn,
  // Задание 6
  imageInput,
  // Задание 7
  titleInput,
  categoryInput,
  servingsInput,
  timeInput,
  ingredientsInput,
  instructionsInput,
  formSubmitBtn,
  // Задание 3
  updateCategoryFilterOptions
} from "./ui.js";

let recipes: Recipe[] = loadRecipes() ?? initialRecipes;

// Задание 7
let editingRecipeId: string | null = null;

function getFilter(): RecipeFilter {
  return {
    query: searchInput.value,
    category: categoryFilter.value as Category | "Все",
    favoritesOnly: favoritesOnly.checked,
    // Задание 2:
    quickOnly: quickOnly.checked
  };
}

function render(): void {
  //Задание 3
  updateCategoryFilterOptions(getCategoryCounts(recipes));

  const filtered = filterRecipes(recipes, getFilter());

  //Задание 1
  const sorted = sortRecipesByTime(filtered, sortSelect.value as SortOrder);

  renderRecipes(sorted);
}

function persistAndRender(): void {
  saveRecipes(recipes);
  render();
}


searchInput.addEventListener("input", render);
categoryFilter.addEventListener("change", render);
favoritesOnly.addEventListener("change", render);

// Задание 1
sortSelect.addEventListener("change", render);

// Задание 2
quickOnly.addEventListener("change", render);

// Задание 5
resetFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "Все";
  sortSelect.value = "none";
  favoritesOnly.checked = false;
  quickOnly.checked = false;
  render();
});


recipeList.addEventListener("click", (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const button = target.closest<HTMLButtonElement>("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;

  // Доп. блок отзывов: Обработка клика по лайку отзыва ===
  if (action === "like-review") {
    const recipeId = button.dataset.recipeId;
    const reviewId = button.dataset.reviewId;
    if (recipeId && reviewId) {
      recipes = toggleReviewLike(recipes, recipeId, reviewId);
      persistAndRender();
    }
    return;
  }

  // Доп. блок отзывов: Удаление отзыва 
  if (action === "delete-review") {
    const recipeId = button.dataset.recipeId;
    const reviewId = button.dataset.reviewId;
    if (recipeId && reviewId) {
      const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот отзыв?");
      if (!isConfirmed) return;

      recipes = deleteReviewFromRecipe(recipes, recipeId, reviewId);
      persistAndRender();
    }
    return;
  }

  const id = button.dataset.id;
  if (!id) return;

  if (action === "favorite") {
    recipes = toggleFavorite(recipes, id);
    persistAndRender();
  } else if (action === "delete") {
    // Задание 4
    const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот рецепт?");
    if (!isConfirmed) return;

    recipes = deleteRecipe(recipes, id);

   
    if (editingRecipeId === id) {
      editingRecipeId = null;
      recipeForm.reset();
      formSubmitBtn.textContent = "Сохранить рецепт";
    }
    persistAndRender();
  } else if (action === "edit") {
    // Задание 7
    const targetRecipe = recipes.find((r) => r.id === id);
    if (!targetRecipe) return;

    editingRecipeId = targetRecipe.id;
    titleInput.value = targetRecipe.title;
    categoryInput.value = targetRecipe.category;
    servingsInput.value = String(targetRecipe.servings);
    timeInput.value = String(targetRecipe.cookingTime);
    imageInput.value = targetRecipe.imageUrl ?? "";
    ingredientsInput.value = targetRecipe.ingredients.join(", ");
    instructionsInput.value = targetRecipe.instructions;

    formSubmitBtn.textContent = "Сохранить изменения";
    recipeForm.scrollIntoView({ behavior: "smooth" });
  }
});

// Доп. блок отзывов: Отправка формы делегирование 
recipeList.addEventListener("submit", (event: SubmitEvent) => {
  const target = event.target;
  if (!(target instanceof HTMLFormElement) || !target.classList.contains("review-form")) return;

  event.preventDefault();
  const recipeId = target.dataset.recipeId;
  if (!recipeId) return;

  const authorInput = target.querySelector<HTMLInputElement>("input[name='reviewAuthor']");
  const textInput = target.querySelector<HTMLTextAreaElement>("textarea[name='reviewText']");

  if (!authorInput || !textInput) return;

  const author = authorInput.value.trim();
  const text = textInput.value.trim();

  if (!author || !text) return;

  recipes = addReviewToRecipe(recipes, recipeId, author, text);
  persistAndRender();
});


recipeForm.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const servings = Number(servingsInput.value);
  const cookingTime = Number(timeInput.value);
  const ingredients = ingredientsInput.value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const instructions = instructionsInput.value.trim();

  // Задание 6
  const imageUrl = imageInput.value.trim();

  if (!title || !instructions || ingredients.length === 0) {
    formMessage.className = "error";
    formMessage.textContent = "Заполните все поля формы.";
    return;
  }

  if (!Number.isFinite(servings) || servings < 1 || servings > 30) {
    formMessage.className = "error";
    formMessage.textContent = "Количество порций должно быть от 1 до 30.";
    return;
  }

  if (!Number.isFinite(cookingTime) || cookingTime < 1 || cookingTime > 600) {
    formMessage.className = "error";
    formMessage.textContent = "Время должно быть от 1 до 600 минут.";
    return;
  }

  const draft: RecipeDraft = {
    title,
    category: categoryInput.value as Category,
    servings,
    cookingTime,
    ingredients,
    instructions,
    // Задание 6
    ...(imageUrl ? { imageUrl } : {})
  };

  // Задание 7
  if (editingRecipeId !== null) {
    recipes = updateRecipe(recipes, editingRecipeId, draft);
    editingRecipeId = null;
    formSubmitBtn.textContent = "Сохранить рецепт";
    formMessage.className = "success";
    formMessage.textContent = "Рецепт обновлен.";
  } else {
    recipes = [createRecipe(draft), ...recipes];
    formMessage.className = "success";
    formMessage.textContent = "Рецепт добавлен.";
  }

  recipeForm.reset();
  persistAndRender();
});


render();