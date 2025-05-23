const URL_API = "/api/dishes";
const deleteModal = document.querySelector("#delete-modal");
const dishModal = document.querySelector("#dish-modal"); // for update and create

let dishIdToDelete = null; // to save it
let modalMode = "update"; // options are "update" OR "create"

async function showDishes() {
  try {
    const res = await fetch(URL_API);
    const dishes = await res.json();
    const dishesTableBody = document.querySelector("#dishes-table-body");

    dishesTableBody.innerHTML = ""; // clear everything before inserting

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

      // Ingredients as bullet points
      const ingredientsEl = document.createElement("td");
      const ul = document.createElement("ul");

      dish.ingredients.forEach((ingredient) => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        ul.appendChild(li);
      });

      ingredientsEl.appendChild(ul);
      dishRow.appendChild(ingredientsEl);

      // Preparation steps
      const stepsEl = document.createElement("td");
      stepsEl.textContent = dish.preparationSteps;
      dishRow.appendChild(stepsEl);

      const buttonsTd = document.createElement("td");
      const btnBox = document.createElement("div");
      btnBox.className = "btn-box";

      // Update button
      const updateBtn = document.createElement("button");
      updateBtn.className = "btn-update";
      updateBtn.setAttribute("dish-id", dish._id);
      updateBtn.textContent = "Update";
      updateBtn.addEventListener("click", () => {
        // To fill modal with the current dish details
        modalMode = "update";
        document.querySelector("#dish-id").value = dish._id;
        document.querySelector("#dish-name").value = dish.name;
        document.querySelector("#dish-origin").value = dish.origin;
        document.querySelector("#dish-time").value = dish.cookingTime;
        document.querySelector("#dish-difficulty").value = dish.difficulty;
        document.querySelector("#dish-ingredients").value =
          dish.ingredients.join(", ");
        document.querySelector("#dish-steps").value = dish.preparationSteps;
        document.querySelector("#modal-title").textContent = "Update Dish";
        document.querySelector("#submit-btn").textContent = "Save Changes";
        dishModal.classList.remove("hidden");
      });

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-delete";
      deleteBtn.setAttribute("dish-id", dish._id);
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async (e) => {
        dishIdToDelete = e.target.getAttribute("dish-id");
        deleteModal.classList.remove("hidden");
      });

      // Add buttons to the box
      btnBox.appendChild(updateBtn);
      btnBox.appendChild(deleteBtn);

      // Add box to the cell
      buttonsTd.appendChild(btnBox);

      dishRow.appendChild(buttonsTd);

      // Append the complete row to the table body
      dishesTableBody.appendChild(dishRow);
    });
  } catch (err) {
    console.error("Error loading dishes:", err);
  }
}

document.addEventListener("DOMContentLoaded", showDishes);

document.querySelector("#dish-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.querySelector("#dish-id").value;
  const name = document.querySelector("#dish-name").value;
  const origin = document.querySelector("#dish-origin").value;
  const cookingTime = Number(document.querySelector("#dish-time").value);
  const difficulty = document.querySelector("#dish-difficulty").value;
  const preparationSteps = document.querySelector("#dish-steps").value;
  const ingredients = document
    .querySelector("#dish-ingredients")
    .value.split(",")
    .map((ing) => ing.trim());

  const payload = {
    name,
    origin,
    cookingTime,
    difficulty,
    preparationSteps,
    ingredients,
  };

  try {
    if (modalMode === "create") {
      await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(`${URL_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    dishModal.classList.add("hidden");
    showDishes();
  } catch (err) {
    console.error("Save failed:", err);
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

document.querySelector("#add-dish-btn").addEventListener("click", () => {
  modalMode = "create";
  document.querySelector("#dish-id").value = "";
  document.querySelector("#dish-name").value = "";
  document.querySelector("#dish-origin").value = "";
  document.querySelector("#dish-time").value = "";
  document.querySelector("#dish-difficulty").value = "";
  document.querySelector("#dish-ingredients").value = "";
  document.querySelector("#dish-steps").value = "";

  document.querySelector("#modal-title").textContent = "Add New Dish";
  document.querySelector("#submit-btn").textContent = "Create";
  dishModal.classList.remove("hidden");
});

// To close all modals
document.querySelectorAll(".cancel-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Closes correct modal
    const modal = btn.closest(".modal");
    if (modal) modal.classList.add("hidden");
  });
});
