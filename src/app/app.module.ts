import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicStorageModule } from '@ionic/storage'
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation} from '@ionic-native/background-geolocation';
import { AngularFireDatabase, AngularFireDatabaseModule} from 'angularfire2/database'
import { AngularFireModule } from 'angularfire2'


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CurrentLocationPage } from '../pages/current-location/current-location'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CurrentLocationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(
      {
        apiKey: "AIzaSyAEy5U3S4trRZVQ6abIyI8FvavDvwa7zR8",
        authDomain: "findu-f7800.firebaseapp.com",
        databaseURL: "https://findu-f7800.firebaseio.com",
        projectId: "findu-f7800",
        storageBucket: "findu-f7800.appspot.com",
        messagingSenderId: "931764164835"
      }),
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CurrentLocationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    BackgroundGeolocation,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
