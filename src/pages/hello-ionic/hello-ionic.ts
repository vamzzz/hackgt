import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';



@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  bananaBread: Array<{need: string[], added: number}>;
  burger: Array<{need: string[], added: number}>;
  chickenAndBroccoli: Array<{need: string[], added: number}>;
  pancakes: Array<{need: string[], added: number}>;
  tomatoSoup: Array<{need: string[], added: number}>;
  friedChicken: Array<{need: string[], added: number}>;
  potatoAndSteak: Array<{need: string[], added: number}>;

  
  constructor() {
    this.initializeItems();
  }

  turnbananaBread() {
    this.bananaBread = {
      need: ["Pecans"],
      added: 1
    }[0];
    
  }

  initializeItems() {
    this.bananaBread = {
      need: ["Pecans"],
      added: 0
    }[0];
    this.burger = {
      need: ["Buns, Tomato, Lettuce, Ground Beef, Ketchup, American Cheese, Pickles"],
      added: 0
    }[0];
    this.chickenAndBroccoli = {
      need: ["Broccoli, Soy Sauce, Honey, Garlic"],
      added: 0
    }[0];
    this.pancakes = {
      need: ["Milk"],
      added: 0
    }[0];
    this.tomatoSoup = {
      need: ["Garlic, Tomato, Onion"],
      added: 0
    }[0];
    this.friedChicken = {
      need: ["Chicken Wings, Oil"],
      added: 0
    }[0];
    this.potatoAndSteak = {
      need: ["Steak, Potato, Rosemary, Garlic"],
      added: 0
    }[0];
  }
}
