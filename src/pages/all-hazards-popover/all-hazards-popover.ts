import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the AllHazardsPopover page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-all-hazards-popover',
  templateUrl: 'all-hazards-popover.html'
})
export class AllHazardsPopoverPage {

  public mapIcon: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllHazardsPopoverPage');
    console.log(this.mapIcon)
  }

}
