const URL_API = "/api/dishes";
// decide if you want to have this saved as const to use around or not (like the updateModal)
const deleteModal = document.querySelector("#delete-modal");

let dishIdToDelete = null; // to save it

async function showDishes() {
  try {
    const res = await fetch(URL_API);
    const dishes = await res.json();
    const dishesTableBody = document.querySelector("#dishes-table-body");

    dishesTableBody.innerHTML = ""; // Clear before inserting

    dishes.forEach((dish) => {
      const dishRow = document.createElement("tr");

      // Name
      const nameEl = document.createElement("td");
      nameEl.textContent = dish.name;
      dishRow.appendChild(nameEl);

      // Origin
      const originEl = document.createElement("td");
      originEl.textContent = dish.origin;
      dishRow.appendChild(originEl);

      // Cooking Time
      const timeEl = document.createElement("td");
      timeEl.textContent = `${dish.cookingTime} min`;
      dishRow.appendChild(timeEl);

      // Difficulty
      const difficultyEl = document.createElement("td");
      difficultyEl.textContent = dish.difficulty;
      dishRow.appendChild(difficultyEl);

      // Ingredients
      const ingredientsEl = document.createElement("td");
      ingredientsEl.textContent = dish.ingredients;
      dishRow.appendChild(ingredientsEl);

      // Preparation steps
      const stepsEl = document.createElement("td");
      stepsEl.textContent = dish.preparationSteps;
      dishRow.appendChild(stepsEl);

      const buttonsTd = document.createElement("td");

      // Update button
      const updateBtn = document.createElement("button");
      updateBtn.className = "btn-update";
      updateBtn.setAttribute("dish-id", dish._id);
      updateBtn.textContent = "Update";
      updateBtn.addEventListener("click", () => {
        // To fill modal with the current dish details
        document.querySelector("#update-id").value = dish._id;
        document.querySelector("#update-name").value = dish.name;
        document.querySelector("#update-origin").value = dish.origin;
        document.querySelector("#update-time").value = dish.cookingTime;
        document.querySelector("#update-difficulty").value = dish.difficulty;
        document.querySelector("#update-ingredients").value =
          dish.ingredients.join(", ");
        document.querySelector("#update-steps").value = dish.preparationSteps;
        document.querySelector("#update-modal").classList.remove("hidden");
      });
      buttonsTd.appendChild(updateBtn);

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-delete";
      deleteBtn.setAttribute("dish-id", dish._id);
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async (e) => {
        dishIdToDelete = e.target.getAttribute("dish-id");
        deleteModal.classList.remove("hidden");
      });
      buttonsTd.appendChild(deleteBtn);

      dishRow.appendChild(buttonsTd);

      // Append the complete row to the table body
      dishesTableBody.appendChild(dishRow);
    });
  } catch (err) {
    console.error("Error loading dishes:", err);
  }
}

document.addEventListener("DOMContentLoaded", showDishes);

document.querySelector("#update-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // To get the values (whether changed or the current ones)
  const id = document.querySelector("#update-id").value;
  const name = document.querySelector("#update-name").value;
  const origin = document.querySelector("#update-origin").value;
  const cookingTime = Number(document.querySelector("#update-time").value);
  const difficulty = document.querySelector("#update-difficulty").value;
  const preparationSteps = document.querySelector("#update-steps").value;
  const ingredients = document
    .querySelector("#update-ingredients")
    .value.split(",")
    .map((ing) => ing.trim());

  try {
    await fetch(`${URL_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        origin,
        cookingTime,
        difficulty,
        preparationSteps,
        ingredients,
      }),
    });

    document.querySelector("#update-modal").classList.add("hidden");
    showDishes();
  } catch (err) {
    console.error("Update failed:", err);
  }
});

document
  .querySelector("#confirm-delete-btn")
  .addEventListener("click", async () => {
    try {
      await fetch(`${URL_API}/${dishIdToDelete}`, { method: "DELETE" });
      showDishes();
    } catch (err) {
      console.error("Error when deleting:", err);
    } finally {
      deleteModal.classList.add("hidden");
      dishIdToDelete = null;
    }
  });

// To close both modals
document.querySelectorAll(".cancel-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // closes correct modal
    const modal = btn.closest(".modal");
    if (modal) modal.classList.add("hidden");
  });
});
