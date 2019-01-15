// Money Class: Represents a Transaction
class Money {
  constructor(date, name, amount) {
    this.date = date;
    this.name = name;
    this.amount = amount;
  }
}

// UI Class: Handle UI Tasks test
class UI {
  static displayTransaction() {
    const Trans = Debt_Owed.getDebt();

    Trans.forEach(money => UI.addTransToList(money));
  }

  static addTransToList(money) {
    const list = document.querySelector("#debt-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${money.date}</td>
        <td>${money.name}</td>
        <td>${money.amount}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;

    list.appendChild(row);
  }

  static deleteTransaction(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#debt-form");
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#date").value = "";
    document.querySelector("#name").value = "";
    document.querySelector("#amount").value = "";
  }
}

// Store Class: Handles Storage
class Debt_Owed {
  static getDebt() {
    let debt;
    if (localStorage.getItem("debt") === null) {
      debt = [];
    } else {
      debt = JSON.parse(localStorage.getItem("debt"));
    }

    return debt;
  }

  static addTransaction(trans) {
    const debt = Debt_Owed.getDebt();
    debt.push(trans);
    localStorage.setItem("debt", JSON.stringify(debt));
  }

  static removeTransaction(amount) {
    const debt = Debt_Owed.getDebt();

    debt.forEach((trans, index) => {
      if (trans.amount === amount) {
        debt.splice(index, 1);
      }
    });

    localStorage.setItem("debt", JSON.stringify(debt));
  }
}

// Event: Display Transaction
document.addEventListener("DOMContentLoaded", UI.displayTransaction);

// Event: Add a Transaction
document.querySelector("#debt-form").addEventListener("submit", e => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const date = document.querySelector("#date").value;
  const name = document.querySelector("#name").value;
  const amount = document.querySelector("#amount").value;

  // Validate
  if (date === "" || name === "" || amount === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instatiate Transaction
    const money = new Money(date, name, amount);

    // Add transaction to UI
    UI.addTransToList(money);

    // Add transaction to store
    Debt_Owed.addTransaction(money);

    // Show success message
    UI.showAlert("Transaction Added", "success");

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Transaction
document.querySelector("#debt-list").addEventListener("click", e => {
  // Remove Transaction from UI
  UI.deleteTransaction(e.target);

  // Remove Transaction from store
  Debt_Owed.removeTransaction(
    e.target.parentElement.previousElementSibling.textContent
  );

  // Show success message
  UI.showAlert("Transaction Removed", "success");
});
