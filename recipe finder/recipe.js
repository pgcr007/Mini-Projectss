const api_key = "3fbeb97b36fa4970932282b4b2d37e62";
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function fetchrecipe()
{
    const inginput = document.getElementById("ing-input").value.trim();
    const dietfilter = document.getElementById("dietfilter").value;
    const healthfilter = document.getElementById("healthfilter").value;

    if(!inginput){
        alert("Please enter at least one Ingredient");
        return;
    }

    document.getElementById("loading").style.display = "block";

    try{
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${inginput}&diet=${dietfilter}&intolerances=${healthfilter}&apiKey=${api_key}&number=10&addRecipeInformation=true`);
        const data = await response.json();

        document.getElementById("loading").style.display = "none";
        displayrecipe(data.results);
    }
    catch(error)
    {
        console.error("Error fetching recipes:", error);
        alert("Failed to fetch Recipes. Try Again Later");
        document.getElementById("loading").style.display = "none";
    }

}

function displayrecipe(meals)
{
    const recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = "";

    if(!meals.length)
    {
        recipeList.innerHTML = "<p> No Recipes Found. Try again later.</p>";
        return;
    }


meals.forEach(meal => {
    const recipediv = document.createElement("div");
    recipediv.classList.add("recipe");
    recipediv.innerHTML = `
    <img src="${meal.image}" alt = "${meal.title}">
    <div>
    <h3>${meal.title}</h3>
    <p><strong>Cooking Time:</strong>${meal.readyInMinutes}min</p>
    <a href="${meal.sourceUrl}" target="_blank">View Recipe</a>
    <button class="favourite-btn" onclick="addtofavorite('${meal.title}', '${meal.image}', '${meal.sourceUrl}')">❤️ Add to Favorites</button>
    </div>
    `;
    recipeList.appendChild(recipediv);
});
}

function addtofavorite(name,img,url)
{
    if(favorites.some(fav => fav.url === url)) {
        alert("Recipe already in Favorites");
        return;
    }

    favorites.push({name,img,url});
    localStorage.setItem("favorites",JSON.stringify(favorites));
    displayfavorites();
}

function displayfavorites()
{
    const favoriteslist = document.getElementById("favoriteslist");    
    favoriteslist.innerHTML = "";

    favorites.forEach(fav => {
        const favdiv = document.createElement("div");
        favdiv.classList.add("favorite");
        favdiv.innerHTML = `
        <img src="${fav.img}" alt="${fav.name}">
        <div>
        <h3>${fav.name}</h3>
        <a href = "${fav.url}" target="_blank">View Recipe</a>
        <button class="favourite-btn" onclick="removefromfavorites('${fav.url}')">Remove</button>
        </div>
        `;

        favoriteslist.appendChild(favdiv);
    });
}

function removefromfavorites(url)
{
    const index = favorites.findIndex(fav => fav.url === url);
    if(index!== -1)
    {
        favorites.splice(index,1);
        localStorage.setItem("favorites",JSON.stringify(favorites));
        displayfavorites();
    }
}

document.addEventListener("DOMContentLoaded",displayfavorites);

