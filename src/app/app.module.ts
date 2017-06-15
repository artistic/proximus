import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";

import { GeofenceDetailsPage } from "../pages/geofence-details/geofence-details";
import { GeofenceListItem } from "../components/geofence-list-item/geofence-list-item";
import { GeofenceListPage } from "../pages/geofence-list/geofence-list";
import { GeofenceService } from "../services/geofence-service";
import { Auth } from '../providers/auth';
import { MyApp } from "./app.component";
import { LoggingModePage } from  "../pages/logging-mode/logging-mode";
import { FindHazardsPage } from '../pages/find-hazards/find-hazards';
import { AngularFireModule } from 'angularfire2';
import{ AuthPage} from '../pages/auth/auth';
import { AllHazardsPage } from '../pages/all-hazards/all-hazards';
import { LocationTracker } from '../providers/location-tracker';
import { DataAnalysisPage } from '../pages/data-analysis/data-analysis';
import { PresentationModePage } from "../pages/presentation-mode/presentation-mode";
import { AllHazardsPopoverPage } from '../pages/all-hazards-popover/all-hazards-popover';

 const firebaseConfig = {
    apiKey: "AIzaSyBFr4nPQ-G7uVBgwwm4pMGGqvdAyAIfEaI",
    authDomain: "fbcrud-ceada.firebaseapp.com",
    databaseURL: "https://fbcrud-ceada.firebaseio.com",
    storageBucket: "fbcrud-ceada.appspot.com",
    messagingSenderId: "432170397686"
  };

const components = [
  MyApp,
  GeofenceDetailsPage,
  GeofenceListPage,
  GeofenceListItem,
  LoggingModePage,
  FindHazardsPage,
  AuthPage,
  AllHazardsPage,
  DataAnalysisPage,
  PresentationModePage,
  AllHazardsPopoverPage
]

@NgModule({
  declarations: components,
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: components,
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GeofenceService,
    Auth,
    LocationTracker,
    // NavController
  ]
})
export class AppModule {}
