import { Component } from "@angular/core";
import { NavController, Platform, MenuController } from "ionic-angular";
import { GeofenceDetailsPage } from "../geofence-details/geofence-details";
import { GeofenceService } from "../../services/geofence-service";
import { LocationTracker } from '../../providers/location-tracker';
import { Splashscreen } from "ionic-native";
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  templateUrl: "geofence-list.html"
})
export class GeofenceListPage {
  isLoading: boolean = false;
  geofences: [Geofence];
  locations:FirebaseListObservable<any>;
  hazardTypes:any;

  constructor(
    private nav: NavController,
    private geofenceService: GeofenceService,
    private platform: Platform,
    private menu: MenuController,
    public ngFire: AngularFire,
    public locationService: LocationTracker
  ) {
    this.isLoading = true;
    this.platform.ready().then(() => {
      this.geofenceService.findAll()
        .then(geofences => {
          this.geofences = geofences;

          this.isLoading = false;
        })
        .catch(() => this.isLoading = false);
    });

    this.locations = ngFire.database.list("/locations");

    this.hazardTypes = [
      {name:"Battery Hazard",imgURL:"battery_hazard.png"},
      {name:"BioHazard",imgURL:"biohazard.png"},
      {name:"Corrosive Hazard",imgURL:"corrosive.png"},
      {name:"Cutting Hazard",imgURL:"cutting.png"},
      {name:"Danger of Cutter",imgURL:"danger_of_cutter.png"},
      {name:"Danger of Death",imgURL:"danger_of_death.png"},
      {name:"Electrical Hazard",imgURL:"electricity.png"},
      {name:"Entrapment Hazard",imgURL:"entrapment_hazard.png"},
      {name:"Explosion Hazard",imgURL:"explosion.png"},
      {name:"Falling Objects",imgURL:"falling_objects.png"},
      {name:"Flammable Material",imgURL:"flammable.png"},
      {name:"Fork Lift Moving",imgURL:"fork_lift.png"},
      {name:"Gas Bottle Hazard",imgURL:"gas_bottles.png"},
      {name:"General Hazard",imgURL:"general_hazard.png"},
      {name:"Glass Hazard",imgURL:"glass_hazard.png"},
      {name:"Hand Injury Hazard",imgURL:"hand_hazard.png"},
      {name:"High Temperature",imgURL:"high_temperature.png"},
      {name:"High Voltage",imgURL:"high_voltage.png"},
      {name:"Hot Surface",imgURL:"hot_surface.png"},
      {name:"Irritant Hazard",imgURL:"irritant.png"},
      {name:"Laser Radiation",imgURL:"laser_radiation.png"},
      {name:"Low Temperature",imgURL:"low_temperature.png"},
      {name:"Strong Magnetic Field",imgURL:"magnetic_field.png"},
      {name:"Non Ionizing Rays",imgURL:"non_ionizing.png"},
      {name:"Optical Radiation",imgURL:"optical_radiation.png"},
      {name:"Overhead Crane",imgURL:"overhead_crane.png"},
      {name:"Oxidizing Agent",imgURL:"oxidizing.png"},
      {name:"Radiation",imgURL:"radiation.png"},
      {name:"Rotating Objects",imgURL:"rotating_objects.png"},
      {name:"Slippery Floor/Ground",imgURL:"slippery.png"},
      {name:"Suffocation Hazard",imgURL:"suffocation.png"},
      {name:"Toxic Chemicals",imgURL:"toxic.png"},
      {name:"Tripping Hazard",imgURL:"tripping.png"},
     
    ]

 
  }

  ionViewDidEnter() {
    this.menu.enable(true);
  }

  ionViewLoaded() {
    Splashscreen.hide();
  }


  new(){

    console.log(this.locationService.lat);
   
        const geofence = this.geofenceService.create({
          longitude: this.locationService.lng,
          latitude: this.locationService.lat,
        });
   
        this.transitionToDetailsPage(geofence);
    
  }


  itemSelected(x) {
    console.log(x)
  }
  geofenceItemTapped(geofence) {
    this.transitionToDetailsPage(geofence);
  }

  transitionToDetailsPage(geofence) {
    this.nav.push(GeofenceDetailsPage, {
      geofence
    })
  }



  
}
