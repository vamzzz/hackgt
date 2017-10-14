function searchFood(foodText, foodSearches) {
	var result = []
	$.getJSON("https://api.edamam.com/search?q=" + foodText, function(data, status) {
		var div = document.getElementById('foodResults');
		while (div.firstChild) { div.removeChild(div.firstChild); }
		
		for (var index = 0; index < foodSearches; index++) {
			var resultRecipe = { ingredients: [] }
			var recipes = data['hits'];
			var recipe = recipes[index]['recipe'];
		
			var recipeDiv = document.createElement('div');

			var a = document.createElement('a');
			var img = document.createElement('img');
			var h3 = document.createElement('h3');
			var ul = document.createElement('ul');

			recipe['ingredientLines'].forEach(function(ingredient) {
				var li = document.createElement('li');
				var liText = document.createTextNode(ingredient.replace(" ,", ","));
				li.appendChild(liText);
				ul.appendChild(li);
			});

			var h3Text = document.createTextNode(recipe['label']);
			a.href = recipe['url'];
			img.src = recipe['image'];

			a.appendChild(img);
			h3.appendChild(h3Text);
			recipeDiv.appendChild(a);
			recipeDiv.appendChild(h3);
			recipeDiv.appendChild(ul);
			div.appendChild(recipeDiv);

			var firstRecipeIngredients = recipe['ingredients'];
			firstRecipeIngredients.forEach(function(i) {
				resultRecipe.ingredients.push({quantity: i['quantity'],
										measure: i['measure'] == '<unit>' ? "" : i['measure'],
										food: i['food']});})
			result.push(resultRecipe);}
		}
	);
	return result;
}

function getFood() {
	var foodText = document.getElementById('food').value;
	var foodSearches = document.getElementById('options').value;
	if (!foodText || foodSearches < 1) { alert("Please type in a valid food search or search number"); }
	else { return searchFood(foodText, foodSearches); }
}
