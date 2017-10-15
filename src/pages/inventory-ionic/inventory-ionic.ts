import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-inventory-ionic',
  templateUrl: 'inventory-ionic.html'
})
export class InventoryIonicPage {
  stuff: Array<{title: string}>;
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
}
