import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import firebase from 'firebase';


import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    
  firebase.initializeApp({
      apiKey: "AIzaSyAEy5U3S4trRZVQ6abIyI8FvavDvwa7zR8",
      authDomain: "findu-f7800.firebaseapp.com",
      databaseURL: "https://findu-f7800.firebaseio.com",
      projectId: "findu-f7800",
      storageBucket: "findu-f7800.appspot.com",
      messagingSenderId: "931764164835"
    });
  firebase
    .auth()
    .getRedirectResult()
    .then(function(result) {
      if (result.credential) {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(token, user);
      }
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorMessage = error.message;
      console.log(errorMessage);
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

