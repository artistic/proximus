import { Injectable } from "@angular/core";
import generateUUID from "../utils/uuid";
import { AngularFire,FirebaseListObservable } from 'angularfire2';


@Injectable()
export class GeofenceService {
 private geofences: Geofence[];
  locations: FirebaseListObservable<any>;
   constructor(public ngFire: AngularFire) {
    console.log('Hello User');
      this.locations = ngFire.database.list("/locations", {preserveSnapshot:true});
  }
 
  
  create(attributes) {
    console.log('Service Hit');
    const defaultGeofence = {
      id: generateUUID(),
      latitude: 50,
      longitude: 50,
      radius: 100,
      transitionType: window.TransitionType.ENTER,    
      notification: { 
        id: this.getNextNotificationId(),
        title: "PROXiMUS Hazard Notification",
        text: "",
        icon: "res://ic_menu_mylocation",
        openAppOnClick: true,
        data:""
      },
    };

    return Object.assign(defaultGeofence, attributes);
  }

  clone(geofence: Geofence) {
    return JSON.parse(JSON.stringify(geofence));
  }

  addOrUpdate(geofence: Geofence) {
    console.log("Hit Me")
    return window.geofence.addOrUpdate(geofence)
      .then(() => this.findById(geofence.id))
      .then((found) => {
        if (!found) {
         

          this.geofences.push(geofence);
           this.locations.push(geofence);
          
        } else {
          const index = this.geofences.indexOf(found);
          //  this.locations.update(geofence.key,geofence);
          this.geofences[index] = geofence;
        }
      });
  }

  findAll() {
    return window.geofence.getWatched()
      .then((geofencesJson) => {
        const geofences = JSON.parse(geofencesJson);

        this.geofences = geofences;
        return geofences;
      });
  }

  findById(id) {
    const found = this.geofences.filter(g => g.id === id);

    if (found.length > 0) {
      return found[0];
    }

    return undefined;
  }

  removeAll() {
    return window.geofence.removeAll().then(() => {
      this.geofences.length = 0;
    });
  }

  remove(geofence) {
    return window.geofence.remove(geofence.id).then(() => {
      this.geofences.splice(this.geofences.indexOf(geofence), 1);
    });
  }

  private getNextNotificationId() {
    var max = 0;

    this.geofences.forEach(function (gf) {
      if (gf.notification && gf.notification.id) {
        if (gf.notification.id > max) {
          max = gf.notification.id;
        }
      }
    });

    return max + 1;
  }
}
