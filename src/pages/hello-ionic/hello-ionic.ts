import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';



@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
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
