const products = [
  { id: "honey-wheat", name: "Honey Wheat Loaf", category: "breads", price: 8 },
  { id: "sourdough", name: "Sourdough Boule", category: "breads", price: 9 },
  { id: "croissant", name: "Butter Croissant", category: "pastries", price: 4 },
  { id: "danish", name: "Almond Danish", category: "pastries", price: 5 },
  { id: "lemon-cake", name: "Lemon Loaf Cake", category: "cakes", price: 18 },
  { id: "choc-cake", name: "Chocolate Layer Cake", category: "cakes", price: 35 }
];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let favoritesList = null;

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(function (favId) {
      return favId !== id;
    });
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  showProducts();
  showFavorites();
}

function makeItem(product) {
  const item = document.createElement("li");
  const text = document.createElement("span");
  const button = document.createElement("button");

  text.textContent = product.name + " - $" + product.price;
  button.type = "button";
  button.className = "fav-button";
  if (favorites.includes(product.id)) {
    button.textContent = "Remove favorite";
    button.classList.add("saved");
  } else {
    button.textContent = "Add to favorites";
  }
  button.addEventListener("click", function () {
    toggleFavorite(product.id);
  });

  item.appendChild(text);
  item.appendChild(button);
  return item;
}

function showProducts() {
  document.querySelectorAll("h3").forEach(function (heading) {
    const category = heading.textContent.trim().toLowerCase();
    const list = heading.nextElementSibling.querySelector("ul");
    list.innerHTML = "";
    products
      .filter(function (product) {
        return product.category === category;
      })
      .forEach(function (product) {
        list.appendChild(makeItem(product));
      });
  });
}

function showFavorites() {
  favoritesList.innerHTML = "";
  if (favorites.length === 0) {
    favoritesList.innerHTML = "<li>No favorites yet.</li>";
    return;
  }
  products
    .filter(function (product) {
      return favorites.includes(product.id);
    })
    .forEach(function (product) {
      const item = document.createElement("li");
      item.textContent = product.name + " - $" + product.price;
      favoritesList.appendChild(item);
    });
}

if (document.querySelector("h3")) {
  const heading = document.createElement("h2");
  heading.textContent = "Your favorites";
  favoritesList = document.createElement("ul");
  document.body.appendChild(heading);
  document.body.appendChild(favoritesList);
  showProducts();
  showFavorites();
}

const form = document.querySelector("form");

function setError(field, message) {
  const label = field.closest("label");
  let error = label.querySelector(".error");
  if (!error) {
    error = document.createElement("span");
    error.className = "error";
    label.appendChild(error);
  }
  error.textContent = message;
  field.classList.toggle("invalid", message !== "");
  return message === "";
}

function checkName() {
  const input = form.querySelector('input[type="text"]');
  const value = input.value.trim();
  if (value === "") {
    return setError(input, "Please enter your name.");
  }
  if (value.length < 2) {
    return setError(input, "Name must be at least 2 characters.");
  }
  return setError(input, "");
}

function checkEmail() {
  const input = form.querySelector('input[type="email"]');
  if (input.value.trim() === "") {
    return setError(input, "Please enter your email.");
  }
  if (!/^\S+@\S+\.\S+$/.test(input.value.trim())) {
    return setError(input, "Please enter a valid email.");
  }
  return setError(input, "");
}

function checkType() {
  const first = form.querySelector('input[name="rqtype"]');
  const chosen = form.querySelector('input[name="rqtype"]:checked');
  if (chosen === null) {
    return setError(first, "Please choose a request type.");
  }
  return setError(first, "");
}

if (form) {
  form.noValidate = true;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const results = [checkName(), checkEmail(), checkType()];
    if (results.every(Boolean)) {
      alert("Thank you! Your request has been received.");
      form.reset();
    }
  });

  form.addEventListener("input", function (event) {
    if (!event.target.classList.contains("invalid")) {
      return;
    }
    if (event.target.type === "text") {
      checkName();
    }
    if (event.target.type === "email") {
      checkEmail();
    }
  });

  form.addEventListener("change", function (event) {
    if (event.target.name === "rqtype") {
      checkType();
    }
  });
}
