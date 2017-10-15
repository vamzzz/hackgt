import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import $ from "jquery";

@Component({
  selector: 'page-meals-ionic',
  templateUrl: 'meals-ionic.html'
})
export class MealsPage {
  foods;
  currentRecipes;
  meals: Array<{title: string}>;
  ingredients: Array<{name: string, amount: number}>;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.ingredients = [];
    for(let i = 1; i < 11; i++) {
      this.ingredients.push({
        name: 'Flour ' + i,
        amount: i * 10
      });
    }
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
    this.currentRecipes = [];
    // JQuery.get({
    //   dataType: 'json',
    //   url: "https://api.edamam.com/search?q=" + foodText }
    $.getJSON("https://api.edamam.com/search?q=" + foodText
    , (data: any, textStatus: string, jqXHR: JQueryXHR) ==> {
      var result = data["hits"];
      var recipe = result[0]['recipe'];
      var img = recipe['image'];
      var href = recipe['url'];
      result.push({recipe: recipe, Image: img, href: href});
      console.log(result);
      return result;
      });
      
  }
}
