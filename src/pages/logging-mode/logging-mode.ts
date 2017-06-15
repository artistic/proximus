import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GeofenceListPage } from '../geofence-list/geofence-list';
import { FindHazardsPage } from '../find-hazards/find-hazards';
import { AuthPage } from '../auth/auth';
import { AllHazardsPage } from '../all-hazards/all-hazards';

@Component({
  selector: 'page-logging-mode',
  templateUrl: 'logging-mode.html'
})
export class LoggingModePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
   
if(!this.isLoggedIn()){

 
  console.log('You are not logged in')
  this.navCtrl.setRoot(AuthPage)
}

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoggingModePage');
  }

  goToFindHazards(){
    this.navCtrl.push(FindHazardsPage)
  }

  goToHazards(){
    this.navCtrl.push(GeofenceListPage);
  }

  // Auth Stuff

  isLoggedIn(){
    if(window.localStorage.getItem("user")){
      return true;
    }
  }


  logOut(){
      window.localStorage.removeItem("user");
      this.navCtrl.setRoot(AuthPage)
  }

}
