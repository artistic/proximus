
import { Component } from '@angular/core';
import { NavController, NavParams,MenuController,Platform } from 'ionic-angular';
import * as Leaflet from "leaflet";
import { GeofenceService } from "../../services/geofence-service";
import { LocationTracker } from '../../providers/location-tracker';
import { AngularFire,FirebaseListObservable } from 'angularfire2';
import { AuthPage } from '../pages/auth/auth';
import { LoggingModePage } from '../logging-mode/logging-mode';

/*
  Generated class for the AllHazards page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-find-hazards',
  templateUrl: 'find-hazards.html'
})
export class FindHazardsPage {
   private geofence: Geofence;
  private _radius: number;
  private _latLng: any;
  private __latLng: any;
  private notificationText: string;
  private transitionType: string;
  private circle: any;
  private marker: any;
  private map: any;
  locations: FirebaseListObservable<any>;
  public allLocations: any;
  private currentPos: any;
  public otherMap: any;
  public mapIcon:any;
  public userIcon: any;
  public vehicleIcon: any;
  public heavyVehicleIcon: any;
  public excavatorIcon: any;
  public userMarker: any;
  public userCircle:any;


  constructor(
  public navCtrl: NavController,
   public navParams: NavParams,
    private geofenceService: GeofenceService,
    private menu: MenuController,
    public ngFire: AngularFire,
    public locationTracker:LocationTracker,
    platform : Platform
   ) {
     this.locations = ngFire.database.list("/locations");

    this.locationTracker.startTracking();
    this.geofenceService = geofenceService;
    // this.geofence = navParams.get("geofence");
    // this.transitionType = this.geofence.transitionType.toString();
    // this.notificationText = this.geofence.notification.text;
    // this._radius = this.geofence.radius;
    this._radius = 20;
    // this._latLng = Leaflet.latLng(this.geofence.latitude, this.geofence.longitude);
    this._latLng = Leaflet.latLng(-17.773408099999997,31.009046100000003);
    
    this.currentPos = Leaflet.latLng(this.locationTracker.lat,this.locationTracker.lng);
          this.userIcon = L.icon({
    iconUrl: 'assets/leaflet/images/userMarker.png',
   

    iconSize:     [25,25], // size of the icon
  
    iconAnchor:   [12,12], // point of the icon which will correspond to marker's location
    
});


  

    this.vehicleIcon = L.icon({
    iconUrl: 'assets/img/lv.png',
   

    iconSize:     [50,50], // size of the icon
  
    iconAnchor:   [25,25], // point of the icon which will correspond to marker's location
    
});
this.heavyVehicleIcon = L.icon({
    iconUrl: 'assets/img/haulage.png',
   

    iconSize:     [50,50], // size of the icon
  
    iconAnchor:   [25,25], // point of the icon which will correspond to marker's location
    
});
this.excavatorIcon = L.icon({
    iconUrl: 'assets/img/escavator.png',
   

    iconSize:     [50,50], // size of the icon
  
    iconAnchor:   [25,25], // point of the icon which will correspond to marker's location
    
});
    this.mapIcon = this.userIcon; 

   platform.ready().then(() => {
      console.log('Platform Ready!!');
      setInterval(this.getMyPosition.bind(this), 3000);
    });

   }

 

  get radius() {
    return this._radius;
  }

  set radius(value) {
    this._radius = value;
    this.circle.setRadius(value);
  }

  set latLng(value) {
    this._latLng = value;
    this.circle.setLatLng(value);
    this.marker.setLatLng(value);
  }

  get latLng() {
    return this._latLng;
  }

  ionViewDidLoad() {
    this.menu.enable(false);
    // workaround map is not correctly displayed
    // maybe this should be done in some other event
    
   
    
   
 setTimeout(this.loadMap.bind(this), 100);
 
    console.log(this.geofence);
  }

  loadMap() {

    
    this.map = Leaflet
      .map("map")
      .setView(this.currentPos, 1000)
      
    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(this.map);

      // Load all markers for Hazards in Firebase
       this.locations.subscribe(res =>{
            for (var i = 0; i < res.length; i++) {  
         this.__latLng = Leaflet.latLng(res[i].latitude,res[i].longitude);
          let hazardMarkers = L.icon({
    iconUrl:  ""+ res[i].notification.data,
   
    iconSize:     [50,50], // size of the icon
  
    iconAnchor:   [25,50], // point of the icon which will correspond to marker's location
    
});
         this.marker = Leaflet
            .marker(this.__latLng,{icon: hazardMarkers})
                .addTo(this.map);
                 this.circle = Leaflet.circle(this.currentPos, res[i].radius,{color: 'red',fillColor:'#f03',fillOpacity:0.5}).addTo(this.map);
            
                };
                     });

     //Default Hazards TODO--remove these from system
  
           
    this.circle = Leaflet.circle(this.latLng, this.radius,{color: 'red',fillColor:'#f03',fillOpacity:0.5}).addTo(this.map);
 this.otherMap=this.map;


 }

  onMapClicked(e) {
    this.latLng = e.latlng;
  }

  onMarkerPositionChanged(e) {
    const latlng = e.target.getLatLng();

    this.latLng = latlng;
  }

  saveChanges() {
    const geofence = this.geofence;

    geofence.notification.text = this.notificationText;
    geofence.radius = this.radius;
    geofence.latitude = this.latLng.lat;
    geofence.longitude = this.latLng.lng;
    geofence.transitionType = parseInt(this.transitionType, 10);

    this.geofenceService.addOrUpdate(geofence).then(() => {
      this.navCtrl.pop();

      //Save the new location to database
      this.locations.push(geofence);
   
    });
  }


  getMyPosition() {
     if(this.userMarker){
      this.map.removeLayer(this.userMarker);
      this.map.removeLayer(this.userCircle)
    }
    // this.locationTracker.startTracking();

    this.userMarker = Leaflet
      .marker([this.locationTracker.lat,this.locationTracker.lng], {icon: this.mapIcon, draggable: true })
              .addTo(this.map);
               this.userCircle = Leaflet.circle([this.locationTracker.lat,this.locationTracker.lng],25,{color: 'green',fillColor:'#29ab25',fillOpacity:0.5}).addTo(this.map);

    
  }

  stop() {
    this.locationTracker.stopTracking();
  }


goToLogging() {
  this.navCtrl.push(LoggingModePage);
}


}

