import { initialRecipes } from "./data.js";
import { loadRecipes, saveRecipes } from "./storage.js";
import { createRecipe, deleteRecipe, filterRecipes, toggleFavorite, 
// === Задание 1, 3, 7: Импорт функций ===
sortRecipesByTime, getCategoryCounts, updateRecipe, 
// === Доп. блок отзывов: Импорт функций отзывов ===
addReviewToRecipe, toggleReviewLike, deleteReviewFromRecipe // <-- добавили удаление отзыва
 } from "./recipes.js";
import { searchInput, categoryFilter, favoritesOnly, recipeForm, recipeList, formMessage, resultsCount, renderRecipes, 
// === Задание 1, 2, 3, 5, 6, 7: Импорт UI элементов ===
sortSelect, quickOnly, resetFiltersBtn, imageInput, titleInput, categoryInput, savingsInput as servingsInput, timeInput, ingredientsInput, instructionsInput, formSubmitBtn, updateCategoryFilterOptions } from "./ui.js";
let recipes = loadRecipes() ?? initialRecipes;
// === Задание 7: Переменная текущего редактируемого ID ===
let editingRecipeId = null;
function getFilter() {
    return {
        query: searchInput.value,
        category: categoryFilter.value,
        favoritesOnly: favoritesOnly.checked,
        // === Задание 2: Считывание чекбокса «до 30 минут» ===
        quickOnly: quickOnly.checked
    };
}
function render() {
    // === Задание 3: Обновление количества рецептов в селекте категорий ===
    updateCategoryFilterOptions(getCategoryCounts(recipes));
    const filtered = filterRecipes(recipes, getFilter());
    // === Задание 1: Применение сортировки по времени ===
    const sorted = sortRecipesByTime(filtered, sortSelect.value);
    renderRecipes(sorted);
}
function persistAndRender() {
    saveRecipes(recipes);
    render();
}
// Стандартные слушатели
searchInput.addEventListener("input", render);
categoryFilter.addEventListener("change", render);
favoritesOnly.addEventListener("change", render);
// === Задание 1: Слушатель смены сортировки ===
sortSelect.addEventListener("change", render);
// === Задание 2: Слушатель смены чекбокса «до 30 минут» ===
quickOnly.addEventListener("change", render);
// === Задание 5: Обработка клика «Очистить фильтры» ===
resetFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "Все";
    sortSelect.value = "none";
    favoritesOnly.checked = false;
    quickOnly.checked = false;
    render();
});
// Делегирование кликов по списку рецептов
recipeList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement))
        return;
    const button = target.closest("button[data-action]");
    if (!button)
        return;
    const action = button.dataset.action;
    // === Доп. блок отзывов: 3. Обработка клика по лайку отзыва ===
    if (action === "like-review") {
        const recipeId = button.dataset.recipeId;
        const reviewId = button.dataset.reviewId;
        if (recipeId && reviewId) {
            recipes = toggleReviewLike(recipes, recipeId, reviewId);
            persistAndRender();
        }
        return;
    }
    // === Доп. блок отзывов: Удаление отзыва ===
    if (action === "delete-review") {
        const recipeId = button.dataset.recipeId;
        const reviewId = button.dataset.reviewId;
        if (recipeId && reviewId) {
            const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот отзыв?");
            if (!isConfirmed)
                return;
            recipes = deleteReviewFromRecipe(recipes, recipeId, reviewId);
            persistAndRender();
        }
        return;
    }
    const id = button.dataset.id;
    if (!id)
        return;
    if (action === "favorite") {
        recipes = toggleFavorite(recipes, id);
        persistAndRender();
    }
    else if (action === "delete") {
        // === Задание 4: Подтверждение перед удалением через confirm ===
        const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот рецепт?");
        if (!isConfirmed)
            return;
        recipes = deleteRecipe(recipes, id);
        // Сброс формы, если удалили тот рецепт, который сейчас редактировался
        if (editingRecipeId === id) {
            editingRecipeId = null;
            recipeForm.reset();
            formSubmitBtn.textContent = "Сохранить рецепт";
        }
        persistAndRender();
    }
    else if (action === "edit") {
        // === Задание 7: Заполнение полей формы при клике «Редактировать» ===
        const targetRecipe = recipes.find((r) => r.id === id);
        if (!targetRecipe)
            return;
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
// === Доп. блок отзывов: Отправка формы отзыва через делегирование submit ===
recipeList.addEventListener("submit", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLFormElement) || !target.classList.contains("review-form"))
        return;
    event.preventDefault();
    const recipeId = target.dataset.recipeId;
    if (!recipeId)
        return;
    const authorInput = target.querySelector("input[name='reviewAuthor']");
    const textInput = target.querySelector("textarea[name='reviewText']");
    if (!authorInput || !textInput)
        return;
    const author = authorInput.value.trim();
    const text = textInput.value.trim();
    if (!author || !text)
        return;
    recipes = addReviewToRecipe(recipes, recipeId, author, text);
    persistAndRender();
});
// Обработка формы создания / редактирования рецепта
recipeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    const servings = Number(servingsInput.value);
    const cookingTime = Number(timeInput.value);
    const ingredients = ingredientsInput.value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    const instructions = instructionsInput.value.trim();
    // === Задание 6: Считывание ссылки на картинку ===
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
    const draft = {
        title,
        category: categoryInput.value,
        servings,
        cookingTime,
        ingredients,
        instructions,
        // === Задание 6: Запись ссылки в драфт ===
        ...(imageUrl ? { imageUrl } : {})
    };
    // === Задание 7: Ветвление логики обновления с Partial<RecipeDraft> или создания ===
    if (editingRecipeId !== null) {
        recipes = updateRecipe(recipes, editingRecipeId, draft);
        editingRecipeId = null;
        formSubmitBtn.textContent = "Сохранить рецепт";
        formMessage.className = "success";
        formMessage.textContent = "Рецепт обновлен.";
    }
    else {
        recipes = [createRecipe(draft), ...recipes];
        formMessage.className = "success";
        formMessage.textContent = "Рецепт добавлен.";
    }
    recipeForm.reset();
    persistAndRender();
});
// Стартовый рендер
render();
//# sourceMappingURL=main.js.map