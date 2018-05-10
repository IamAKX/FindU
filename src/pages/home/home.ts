import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import firebase from 'firebase';
import { Storage } from '@ionic/storage'
import { CurrentLocationPage } from '../current-location/current-location';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	
  user : any = {
    loggedIn : false,
    name : '',
    username : '',
    email : '',
    profileImg : 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-64.png',
    token : '',
    location : {
      lat : 0,
      lng : 0
    }
  };

  constructor(public navCtrl: NavController,
  						private storage : Storage) {

   //  firebase.auth().onAuthStateChanged( res => {
	  //   if (res) {
	  //     console.log(res);
	  //     this.setUser(res);
   //      this.navCtrl.push(CurrentLocationPage);  
	  //   } else {
	  //     console.log("There's no user here");
	  //   }
	  // });
      
  }


  ionViewDidLoad(){
    // this.storage.get('user')
    //       .then( value => {
    //         this.user = JSON.parse(value);
            
    //     }, err => {
            
    //   });

    //   if(this.user.loggedIn){

    //     this.navCtrl.push(CurrentLocationPage,{'username':this.user.username}).then( () => {
    //       this.navCtrl.remove(0);
    //     },err => {
    //       alert(err);
    //     });
        
    //   }
  }
  
  socialLogin(socialNetwork){
    
    let provider = null;
  	switch (socialNetwork) {
  		case "facebook":
  			provider = new firebase.auth.FacebookAuthProvider();
  			break;
  		case "google":
  			provider = new firebase.auth.GoogleAuthProvider();
  			break;
		case "twitter":
  			provider = new firebase.auth.TwitterAuthProvider();
  			break;
  	}

  	firebase.auth().signInWithRedirect(provider).then( () => {
	    firebase.auth().getRedirectResult().then( result => {
        this.setUser(result);
        this.storage.set('user',JSON.stringify(this.user));
        this.navCtrl.push(CurrentLocationPage,{'user':this.user}).then( () => {
          this.navCtrl.remove(0);
        },err => {
          alert(err);
        });
        
		  },err => {
		    	alert(err);	
		  })
		}, err => {
	 		alert(err);
	 	});
  }

  setUser(res){
    try{
     
      this.user.loggedIn = true;
      this.user.name = res.user.displayName;
      this.user.username = res.user.email.split('.').join('_');
      this.user.email = res.user.email;
      this.user.profileImg = res.user.photoURL;
      this.user.token = res.credential.accessToken;

    }
    catch(err){
      alert('setuser\n'+err);
    }
  }

  emailLogin()
  {
    this.navCtrl.push(CurrentLocationPage,{'username':'akx_sonu@gmail.com'}).then( () => {
          this.navCtrl.remove(0);
        },err => {
          alert(err);
        });
  }

}
