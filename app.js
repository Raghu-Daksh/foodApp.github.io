const mealsEl = document.getElementById("meals");
const favContanier = document.getElementById("fav-meals");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const mealpPopup = document.getElementById("meal-popup");
const popupCloseBtn = document.getElementById("close-popup");
const mealInfoEl = document.getElementById("meal-info");

getRandomMeal();
fetchFavMeals();

// get random meal from api
async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respData = await resp.json();
  const randomeal = respData.meals[0];

  addMeal(randomeal, true);
}

// get  random  meal with help of id
async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const respData = await resp.json();
  const meal = await respData.meals[0];

  return meal;
}
// get meal with the help of search
async function getMealBySearch(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const respData = await resp.json();
  const meals = respData.meals;
  return meals;
}

// add meal to display the screen

const addMeal = (mealdata, random = false) => {
  console.log(mealdata);


  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = `
  <div class="meal-header">
       ${random ? ` <span class="random">random-Recipe</span>` : ""}
      <img src=${mealdata.strMealThumb} alt=${mealdata.strMeal} />
  </div>
  <div class="meal-body">
     <h4>${mealdata.strMeal}</h4>
     <button class="fav-btn">
      <i class="fas fa-heart"></i>
     </button>
  </div>`;

  const btn = meal.querySelector(".fav-btn");

  btn.addEventListener("click", () => {
    
    if (btn.classList.contains("active")) {
      removeMealsLS(mealdata.idMeal);
      btn.classList.remove("active");
    } 
    else {
      addMealsLS(mealdata.idMeal);
      btn.classList.add("active");
    }

    // clean the container
    favContanier.innerHTML = " ";
    fetchFavMeals();
  });

  const mealHeader = meal.querySelector('.meal-header');

  mealHeader.addEventListener("click", () => {
    showMealInfo(mealdata);
  });

  mealsEl.appendChild(meal);
};

// add  to local storage
function addMealsLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

// remove meal  from the local storrage
function removeMealsLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

// get meal  from  the localstorage
function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  console.log(mealIds);

  return mealIds === null ? [] : mealIds;
}

// add  favorte meal  to the favorite contaier4
async function fetchFavMeals() {
  favContanier.innerHTML = " ";

  const mealIds = getMealsLS();
  const meals = [];

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    const meal = await getMealById(mealId);
    addMealFav(meal);
  }

  console.log(meals);
}

// function to add  the meal from the menu
function addMealFav(mealdata) {
  const favMeals = document.createElement("li");

  favMeals.innerHTML = `
  <img src="${mealdata.strMealThumb}" alt="${mealdata.strMeal}" />
  <span>${mealdata.strMeal}</span>
  <button class= "clear"><i class="fa-solid fa-circle-xmark"></i></button>
  `;
  const clearBtn = favMeals.querySelector(".clear");

  // function to remove  the meal from the favorite container
  clearBtn.addEventListener("click", () => {
    removeMealsLS(mealdata.idMeal);
    fetchFavMeals();
  });

  const favImg = favMeals.querySelector('img');
  favImg.addEventListener("click", () => {
    showMealInfo(mealdata);
  });
  favContanier.appendChild(favMeals);
}

// show meal information on screen
function showMealInfo(mealdata) {
  mealInfoEl.innerHTML = "";

  const mealEl = document.createElement("div");
  mealEl.innerHTML = `
        <h1>Meal ${mealdata.strMeal}</h1>
        <img
          src="${mealdata.strMealThumb}"
          alt=""
        />
        <p>
          ${mealdata.strInstructions}
        </p>
        <h3>Ingredients </h3>
        <ul>
            <li>${mealdata.strIngredient1}</li>
            <li>${mealdata.strIngredient2}</li>
            <li>${mealdata.strIngredient3}</li>
        </ul>
        
  `;

  mealInfoEl.appendChild(mealEl);
  mealpPopup.classList.remove("hidden");
}

searchBtn.addEventListener("click", async () => {
  mealsEl.innerHTML = "";
  const search = searchTerm.value;

  const meals = await getMealBySearch(search);
  meals.map((meal) => {
    addMeal(meal);
  });
});

popupCloseBtn.addEventListener("click", () => {
  mealpPopup.classList.add("hidden");
});
