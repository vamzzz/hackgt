var config = {
	apiKey: "AIzaSyAMLlEZ2LNIAQMEdio1c7g8kIh5C1Hvqok",
	authDomain: "grocer-ease.firebaseapp.com",
	databaseURL: "https://grocer-ease.firebaseio.com",
	projectId: "grocer-ease",
	storageBucket: "grocer-ease.appspot.com",
	messagingSenderId: "317395779439"
};
firebase.initializeApp(config);

firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

var database = firebase.database();

var shoppingList = [] // users current shopping list of ingredients
var currentRecipes = [] // dictionary holding list of recipes currently displayed on screen
var ingredientCompare = {}
var potentialCatalogItems = {}

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

	var listShop = {}
	// console.log('SLIST', shoppingList);

	for (var i = 0; i < shoppingList.length; i++) {
		for (var j = 0; j < shoppingList[i]["ingredients"].length; j++) {

			var ingredientItem = shoppingList[i]["ingredients"][j];
			var foodItem = ingredientItem["food"];
			var attrString = ingredientItem["quantity"] + " " + ingredientItem["measure"];

			if (listShop[foodItem]) {
				// console.log(listShop[foodItem]);
				listShop[foodItem].push(attrString)
			} else {
				listShop[foodItem] = [attrString];
			}

			var li = document.createElement("li");
			var liText = document.createTextNode("(" + ingredientItem["quantity"] + " " + ingredientItem["measure"]+ ") " + ingredientItem["food"])


			li.appendChild(liText);
			ul.appendChild(li);
		}

	}
	ul.appendChild(document.createElement("li"));

	for (var item in listShop) {
		var li = document.createElement("li");
		var liText = document.createTextNode("(" + listShop[item] + ") " + item);
		li.appendChild(liText);
		ul.appendChild(li);
	};

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

function similarity(s1, s2) {
	s1 = String(s1)
	s2 = String(s2)
	$.get({
		url: "https://westus.api.cognitive.microsoft.com/academic/v1.0/similarity?s1=" + s1 + "&s2=" + s2,
		headers: { "Ocp-Apim-Subscription-Key" : 'ea62e1f89d6944c4a4998e21e9eda67c'},
	}, function(data, status) {
		// console.log(data);
		return data;
	});

}

function checkCatalog() {

	// var db = database.ref('catalog').once('value').then(function(snapshot) {
	// 	var value = snapshot.val().;
	// 	console.log(snapshot.key);
	// 	console.log(value);
	// });

	var shoppingList = getLocalStorage();
	// console.log(shoppingList);
	// console.log(shoppingList.length);
	var db = database.ref('catalog');
	db.on('value', function(snapshot) {
		// console.log("Snapshot");
		// console.log(snapshot.val());
		// console.log(snapshot);
	    snapshot.forEach(function(childSnapshot) {
	      var childData = childSnapshot.val();
				// console.log("Child Data");
				// console.log(childData);
				shoppingList.forEach(function(ingredients) {
					// console.log(ingredients["ingredients"]);
					// console.log("Ingredients Array Above");
					for (var i = 0; i < ingredients["ingredients"].length; i++) {
						// console.log(childData["prod_name"]);
						// console.log(ingredients["ingredients"][i]["food"]);
						if (childData["prod_name"].toLowerCase().includes(ingredients["ingredients"][i]["food"])) {
							var sim = similarity(childData["prod_name"], ingredients["ingredients"][i]["food"]);
							if (sim >= 0.75) {
								potentialCatalogItems.push({key : sim, value : childData["prod_id"]});
								potentialCatalogItems.sort( function(a, b) { return b - a; });
								ingredientCompare.push({key : childData["prod_name"], value : potentialCatalogItems});
								console.log(ingredientCompare);
								console.log(ingredients["ingredients"][i]["food"]);
								console.log(ingredients["ingredients"][i]["quantity"]);
								console.log(childData["prod_name"]);
							}
							// console.log(ingredients["ingredients"][i]["food"]);
							// console.log(ingredients["ingredients"][i]["quantity"]);
							// console.log(childData["prod_name"]);
						}
					}
					// console.log(ingredient["food"]);



				});
	    });
	});

}
