import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, AlertController, MenuController } from "ionic-angular";
import * as Leaflet from "leaflet";
import { LoggingModePage } from '../pages/logging-mode/logging-mode';
import { AuthPage } from '../pages/auth/auth';
import { AllHazardsPage } from '../pages/all-hazards/all-hazards';
import { GeofenceListPage } from "../pages/geofence-list/geofence-list";

import { GeofenceService } from "../services/geofence-service";
import { GeofencePluginMock, TransitionType } from "../services/geofence-plugin-mock";
import { FIXTURES } from "../models/geofence";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = AllHazardsPage;

  constructor(
    platform: Platform,
    private alertCtrl: AlertController,
    private geofenceService: GeofenceService,
    private menuCtrl: MenuController,
    // private navCtrl: NavController
  ) {


  
    platform.ready().then(() => {
      Leaflet.Icon.Default.imagePath = "assets/leaflet/images/";

      if (window.geofence === undefined) {
        console.warn("Geofence Plugin not found. Using mock instead.");
        window.geofence = GeofencePluginMock;
        window.TransitionType = TransitionType;
      }

      window.geofence.initialize().then(() => {
        window.geofence.onTransitionReceived = function (geofences) {
          geofences.forEach(function (geo) {
            console.log("Geofence transition detected", geo);
          });
        };

        window.geofence.onNotificationClicked = function (notificationData) {
          console.log("App opened from Geo Notification!", notificationData);
        };
      })
    });
  }

  addFixtures() {
    FIXTURES.forEach((fixture) => this.geofenceService.addOrUpdate(fixture));
    this.menuCtrl.close();
  }

  removeAll() {
    const confirm = this.alertCtrl.create({
      title: "Are you sure?",
      message: "Are you sure you want to remove all geofences?",
      buttons: [
        { text: "No" },
        {
          text: "Yes",
          handler: () => {
            this.geofenceService.removeAll();
          },
        },
      ],
    });
    this.menuCtrl.close();
    confirm.present();
  }
 isLoggedIn(){
    if(window.localStorage.getItem("user")){
      return true;
    }
  }
  testApp() {
    const confirm = this.alertCtrl.create({
      title: "Are you sure?",
      message: "Running tests will remove all your geofences. Do you want to continue?",
      buttons: [
        { text: "No" },
        {
          text: "Yes",
          handler: () => {
            window.location.href = "cdvtests/index.html";
          },
        },
      ],
    });

    this.menuCtrl.close();
    confirm.present();
  }
}
