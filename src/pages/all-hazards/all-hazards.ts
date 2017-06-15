import { Component } from '@angular/core';
import { NavController, NavParams,MenuController,Platform, PopoverController, ViewController, AlertController } from 'ionic-angular';
import * as Leaflet from "leaflet";
import { GeofenceService } from "../../services/geofence-service";
import { LocationTracker } from '../../providers/location-tracker';
import { AngularFire,FirebaseListObservable } from 'angularfire2';
import { AuthPage } from '../auth/auth';
import { LoggingModePage } from '../logging-mode/logging-mode';
import { DataAnalysisPage } from '../data-analysis/data-analysis';
import { PresentationModePage } from '../presentation-mode/presentation-mode';
import { AllHazardsPopoverPage } from '../all-hazards-popover/all-hazards-popover';
import { GeofenceListPage } from '../geofence-list/geofence-list';



/*
  Generated class for the AllHazards page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-all-hazards',
  templateUrl: 'all-hazards.html'
})
export class AllHazardsPage {
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
  public userMarker: any;
  public mapIcon:any;
  public userIcon: any;
  public vehicleIcon: any;
  public heavyVehicleIcon: any;
  public excavatorIcon: any;
  private userLocations:any;
  public userCircle:any;
  


  constructor(
  public navCtrl: NavController,
   public navParams: NavParams,
    private geofenceService: GeofenceService,
    private menu: MenuController,
    public ngFire: AngularFire,
    public locationTracker:LocationTracker,
    public platform:Platform,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,

    public viewCtrl: ViewController
   ) {
     
      if(!this.isLoggedIn()){
        console.log('You are not logged in ');
        this.navCtrl.setRoot(AuthPage);
      } 



      this.userIcon = L.icon({
    iconUrl: 'assets/leaflet/images/userMarker.png',
   

    iconSize:     [25,25], // size of the icon
  
    iconAnchor:   [12,12], // point of the icon which will correspond to marker's location
    
});


  

    this.vehicleIcon = L.icon({
    iconUrl: 'assets/img/lv.png',
   

    iconSize:     [30,30], // size of the icon
  
    iconAnchor:   [15,15], // point of the icon which will correspond to marker's location
    
});
this.heavyVehicleIcon = L.icon({
    iconUrl: 'assets/img/haulage.png',
   

    iconSize:     [30,30], // size of the icon
  
    iconAnchor:   [15,15], // point of the icon which will correspond to marker's location
    
});
this.excavatorIcon = L.icon({
    iconUrl: 'assets/img/excavator.png',
   

    iconSize:     [30,30], // size of the icon
  
    iconAnchor:   [15,15], // point of the icon which will correspond to marker's location
    
});


this.mapIcon = this.userIcon;
    
     console.log(this.locations)
     this.locations = ngFire.database.list("/locations");

    
    this.geofenceService = geofenceService;
    // this.geofence = navParams.get("geofence");
    // this.transitionType = this.geofence.transitionType.toString();
    // this.notificationText = this.geofence.notification.text;
    // this._radius = this.geofence.radius;
    this._radius = 20;
    // this._latLng = Leaflet.latLng(this.geofence.latitude, this.geofence.longitude);
    this._latLng = Leaflet.latLng(this.locationTracker.lat,this.locationTracker.lng);
    
   

    this.locationTracker.startTracking();
   this.currentPos = Leaflet.latLng(this.locationTracker.lat,this.locationTracker.lng);

    platform.ready().then(() => {
      console.log('Platform Ready!!');
      setInterval(this.getMyPosition.bind(this), 5000);
    });

   }//Consstructor


//  Auth Stuff
  isLoggedIn(){
    if(window.localStorage.getItem("user")){

      
      return true;
    }
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
    
    
    
   
 setTimeout(this.loadMap.bind(this), 5000);
    console.log(this.geofence);

    //Send user location to database
     this.userLocations = this.ngFire.database.list("/userLocations");
    this.userLocations.update([this.locationTracker.lat, this.locationTracker.lng]);
  }

getMyPosition() {
    if(this.userMarker){
      this.map.removeLayer(this.userMarker);
      this.map.removeLayer(this.userCircle)
    }

   


    
    console.log('Fire!');

    
     this.userMarker = Leaflet
      .marker([this.locationTracker.lat,this.locationTracker.lng], {icon: this.mapIcon, draggable: true })
              .addTo(this.map);
               this.userCircle = Leaflet.circle([this.locationTracker.lat,this.locationTracker.lng],25,{color: 'green',fillColor:'#29ab25',fillOpacity:0.5}).addTo(this.map);
              this.map.panTo(new L.LatLng(this.locationTracker.lat,this.locationTracker.lng));
    
  }


  loadMap() {

    
    this.map = Leaflet
      .map("map")
      .setView(this.latLng, 5000)
      
    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(this.map);

       

      // Load all markers for Hazards in Firebase
       this.locations.subscribe(res =>{
        console.log(res); 
              for (var i = 0; i < res.length; i++) { 
        var count = res.length;
        var dataID = res[i].notification.id;
        switch(dataID) {
            case 1:
                var hazard_cat = 'milk';
                break;
            case 2:
                var hazard_cat = 'hood';
                break
        }

            
         this.__latLng = Leaflet.latLng(res[i].latitude,res[i].longitude);
           let hazardMarkers = L.icon({
    iconUrl:  ""+ res[i].notification.data,
   
    iconSize:     [30,30], // size of the icon
  
    iconAnchor:   [15,30], // point of the icon which will correspond to marker's location



    
});
         this.marker = Leaflet
            .marker(this.__latLng,{icon:hazardMarkers}).bindPopup
            (
            '<img src="assets/img/default_hazard.png"><p><strong><ion-icon name="warning item-left"></ion-icon>'
            +res[i].notification.text+ 
            '</strong><br /><strong>Latitude : </strong>'
            +res[i].latitude+
            '<br /><strong>Longitude : </strong>'
            +res[i].longitude+
            '<br /><strong>Alert Radius : </strong>'
            +res[i].radius+
            ' meters <br /><strong>Hazard Category : </strong>'
            +count+
            '</p>'
            )


                .addTo(this.map);
                 this.circle = Leaflet.circle(this.__latLng, res[i].radius,{color: 'red',fillColor:'#f03',fillOpacity:0.4}).addTo(this.map);
            
                };
                     });

              
       
 


                
    this.circle = Leaflet.circle(this.latLng, this.radius,{color: 'red',fillColor:'#f03',fillOpacity:0.4}).addTo(this.map);
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


  
  stop() {
    this.locationTracker.stopTracking();
  }


goToLogging() {
  this.navCtrl.push(LoggingModePage);
}

onLocationFound(e) {
  console.log(e);
   this.userMarker.setLatLng(e.latlng);

}

goToDataAnalysis() {
  this.navCtrl.push(DataAnalysisPage);
}

goToPresentationMode() {
  this.navCtrl.push(PresentationModePage);
}


 goToHazards(){
    this.navCtrl.push(GeofenceListPage);
  }



showPopover(event) {
  // let popover = this.popoverCtrl.create(AllHazardsPopoverPage);
  // popover.present({
  //   ev:event
  // });

   let alert = this.alertCtrl.create();
    alert.setTitle('Select Usage Mode');

    alert.addInput({
      type: 'radio',
      label: 'User On Foot',
      value: 'userIcon',
      checked: false
    });
     alert.addInput({
      type: 'radio',
      label: 'User in Light Vehicle',
      value: 'vehicleIcon',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'User in Heavy Vehicle',
      value: 'heavyVehicleIcon',
      checked: false
    });
     alert.addInput({
      type: 'radio',
      label: 'User in Excavator',
      value: 'excavatorIcon',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if(data==="vehicleIcon"){
            this.mapIcon = this.vehicleIcon;
        } else if(data ==="excavatorIcon") {
           this.mapIcon = this.excavatorIcon
        }  else if (data==="heavyVehicleIcon") {
           this.mapIcon = this.heavyVehicleIcon
        }
        else{
          this.mapIcon = this.userIcon
        }

      
      }
    });
    alert.present();

    
  }


closeModal() {
  this.viewCtrl.dismiss();
}


}


