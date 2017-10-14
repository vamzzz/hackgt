var shoppingList = [] // users current shopping list of ingredients
var currentRecipes = [] // dictionary holding list of recipes currently displayed on screen

function searchFood(foodText, foodSearches) {
	currentRecipes = [] // clear past recipes held on new search
	// var result = []
	$.getJSON("https://api.edamam.com/search?q=" + foodText, function(data, status) {
		var div = document.getElementById('foodResults');
		while (div.firstChild) { div.removeChild(div.firstChild); }

		var recipes = data['hits'];
		for (var index = 0; index < foodSearches; index++) {
			var resultRecipe = { ingredients: [] }
			var recipe = recipes[index]['recipe'];
			var recipeDiv = document.createElement('div');

			var a = document.createElement('a');
			var img = document.createElement('img');
			var h3 = document.createElement('h3');
			var ul = document.createElement('ul');
			var button = document.createElement('button');
			button.id = index;
			button.addEventListener('click', function() {
				addRecipe(this.id);
			}, false);
			var buttonContent = document.createTextNode("Add Recipe");

			recipe['ingredientLines'].forEach(function(ingredient) {
				var li = document.createElement('li');
				var liText = document.createTextNode(ingredient.replace(" ,", ","));
				li.appendChild(liText);
				ul.appendChild(li);
			});

			var h3Text = document.createTextNode(recipe['label']);
			a.href = recipe['url'];
			a.target = "_blank";
			img.src = recipe['image'];

			a.appendChild(img);
			h3.appendChild(h3Text);
			button.appendChild(buttonContent);
			recipeDiv.appendChild(a);
			recipeDiv.appendChild(h3);
			recipeDiv.appendChild(ul);
			recipeDiv.appendChild(button);
			div.appendChild(recipeDiv);

			var firstRecipeIngredients = recipe['ingredients'];
			firstRecipeIngredients.forEach(function(i) {
				resultRecipe.ingredients.push({quantity: i['quantity'],
										measure: i['measure'] == '<unit>' ? "" : i['measure'],
										food: i['food']});})
			// result.push(resultRecipe);}
			currentRecipes.push(resultRecipe);
		} // end for loop
	});

	// return result;
	return currentRecipes; // currentRecipes now holds each recipe values
}

function getFood() {
	var foodText = document.getElementById('food').value;
	var foodSearches = document.getElementById('options').value;
	if (!foodText || foodSearches < 1) { alert("Please type in a valid food search or search number"); }
	else { return searchFood(foodText, foodSearches); }
}

function addRecipe(buttonIdString) {
	var intVal = parseInt(buttonIdString);
	// console.log(intVal);
	shoppingList.push(currentRecipes[intVal]);
	setLocalStorage();
}

function getShoppingList() {
	shoppingList = getLocalStorage();
	var div = document.getElementById("shoppingList");
	var ul = document.createElement("ul");
	// console.log(shoppingList.length);
	for (var i = 0; i < shoppingList.length; i++) {
		for (var j = 0; j < shoppingList[i]["ingredients"].length; j++) {
			var ingredientItem = shoppingList[i]["ingredients"][j];
			var li = document.createElement("li");
			var liText = document.createTextNode("(" + ingredientItem["quantity"] + " " + ingredientItem["measure"]+ ") " + ingredientItem["food"])
			li.appendChild(liText);
			ul.appendChild(li);
		}

	}
	div.appendChild(ul);
}

function setLocalStorage() {
	localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

function getLocalStorage() {
		var ret = JSON.parse(localStorage.getItem("shoppingList"));
		console.log(ret);
    return ret;
}

// function checkJSON(url) {
// 	var AJAX_req = new XMLHttpRequest();
//   AJAX_req.open( "GET", url, true );
//   AJAX_req.setRequestHeader("Content-type", "application/json");
//
//   AJAX_req.onreadystatechange = function()
//   {
//       if( AJAX_req.readyState == 4 && AJAX_req.status == 200 )
//       {
//           var response = JSON.parse( AJAX_req.responseText );
//           // document.write( response.name );
// 					console.log(response.snapshot);
//       }
//   }
//   AJAX_req.send();
// }
//
// checkJSON( 'http://localhost:8080/WEB_ONLY/fake_data.json' );
