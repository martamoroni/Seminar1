const API_URL = "/api/dishes";

async function loadDishes() {
  try {
    const res = await fetch(API_URL);
    const dishes = await res.json();
    const tableBody = document.querySelector("#dishes-table-body");

    tableBody.innerHTML = ""; // Clear before inserting

    dishes.forEach((dish) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${dish.name}</td>
        <td>${dish.origin}</td>
        <td>${dish.cookingTime} min</td>
        <td>${dish.difficulty}</td>
        <td>
          <button class="btn btn-edit" data-id="${dish._id}">Update</button>
          <button class="btn btn-delete" data-id="${dish._id}">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    addEventListeners();
  } catch (err) {
    console.error("Error loading dishes:", err);
  }
}

function addEventListeners() {
  document.querySelectorAll(".btn-delete").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (confirm("Are you sure you want to delete this dish?")) {
        try {
          await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          loadDishes();
        } catch (err) {
          console.error("Delete failed:", err);
        }
      }
    })
  );

  document.querySelectorAll(".btn-edit").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const name = prompt("Enter new name:");
      const origin = prompt("Enter new origin:");
      const cookingTime = prompt("Enter new cooking time (in minutes):");
      const difficulty = prompt("Enter difficulty:");

      if (name && origin && cookingTime && difficulty) {
        try {
          await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              origin,
              cookingTime: Number(cookingTime),
              difficulty,
              ingredients: ["Example"], // placeholder
              preparationSteps: "Updated via UI", // placeholder
            }),
          });
          loadDishes();
        } catch (err) {
          console.error("Update failed:", err);
        }
      }
    })
  );
}

document.addEventListener("DOMContentLoaded", loadDishes);
