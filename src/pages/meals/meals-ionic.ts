import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { HelloIonicPage } from '../hello-ionic/hello-ionic'

import * as jQuery from "jquery";


@Component({
  selector: 'page-meals-ionic',
  templateUrl: 'meals-ionic.html'
})
export class MealsPage {
  foods;
  currentRecipes;
  meals;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  logEvent(event, item) {
    this.navCtrl.push(HelloIonicPage, {
      item: item
    });
  }

  getFood(ev) {
    // Reset items back to all of the items
    //this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    return this.searchFood(val, 1);
    }

  searchFood(foodText, foodSearches) {
    var currentRecipes = [];
    jQuery.getJSON("https://api.edamam.com/search?q=" + foodText, function(data, status) {
 //      while (div.firstChild) { div.removeChild(div.firstChild); }
  
      var recipes = data['hits'];
      
      this.meals = recipes;
      console.log(this.meals)
      for (var index = 0; index < foodSearches; index++) {
        var resultRecipe = { ingredients: [] };
        var recipe = recipes[index]['recipe'];

        /* create button to 'add recipe' for each

        var button = document.createElement('button');
        button.id = index;
        button.addEventListener('click', function() {
          addRecipe(this.id);
        }, false);
        var buttonContent = document.createTextNode("Add Recipe");
        */
  
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
}
