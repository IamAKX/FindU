import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, PopoverController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, LatLng, GoogleMapsEvent, MyLocation, GoogleMapsAnimation, Marker, GoogleMapOptions, CameraPosition, LocationService } from '@ionic-native/google-maps';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Storage } from '@ionic/storage'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'

// import { HomePage } from '../home/home';

declare var google:any;

@Component({
  selector: 'page-current-location',
  templateUrl: 'current-location.html',
})
export class CurrentLocationPage {
	
  user  = {
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

  
	@ViewChild('map') mapElement: ElementRef;

  private map:GoogleMap;
  private location:LatLng;
  buddyList : AngularFireList<any[]>;
  watch : any;
  constructor(public navCtrl: NavController, 
  						public navParams: NavParams,
  						private platform:Platform,
              private googleMaps:GoogleMaps,
              public geolocation: Geolocation,
              private backgroundGeolocation: BackgroundGeolocation,
              public zone: NgZone,
              private storage: Storage,
              private firebaseDB: AngularFireDatabase,
              public popoverCtrl: PopoverController) {
      
      this.storage.get('user')
          .then( value => {
            this.user = JSON.parse(value);
            this.user = this.navParams.get('user');
            this.buddyList = firebaseDB.list('/user');
            try{
                firebaseDB.list('/user').set(this.user.username , this.user);
              }
            catch(err)
            {
              alert(err);
            }

             
          }, err => {
            
        });


       
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CurrentLocationPage');
   // alert('didload'+this.user.email.toString());
   
    this.initMap();
    this.loadBuddies();
  }

  initMap(){
  	this.platform.ready()
  		.then( () => {

        const config: BackgroundGeolocationConfig = {
              desiredAccuracy: 0,
              stationaryRadius: 20,
              distanceFilter: 30,
              // debug: true,  //  enable this hear sounds for background-geolocation life-cycle.
              interval:2000,
              startOnBoot : true,
              stopOnStillActivity : false
      };

      this.backgroundGeolocation.configure(config)
        .subscribe((location: BackgroundGeolocationResponse) => {

          console.log('location',location);
          this.zone.run(()=>{
            this.user.location.lat = location.latitude;
            this.user.location.lng = location.longitude;
            //this.latLng = new google.maps.LatLng(this.lat,this.lng);
            this.updateLocation();
          });
        },
        (err)=>{
          alert('Background'+err);
      });

      
      this.backgroundGeolocation.start();

      this.watch = this.geolocation.watchPosition({timeout: 10000, enableHighAccuracy:true }).filter(
        (p:any) => p.code === undefined).subscribe(
        (pos:Geoposition)=>{

          this.zone.run(()=>{
            this.user.location.lat = pos.coords.latitude;
            this.user.location.lng = pos.coords.longitude;
            this.updateLocation();
            
          });

         
        });


			this.geolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy:true })
				.then( position => {
					this.location = new LatLng(position.coords.latitude,position.coords.longitude);
          this.user.location.lat = position.coords.latitude;
          this.user.location.lng = position.coords.longitude;
          //this.latLng = new google.maps.LatLng(this.lat,this.lng);
          this.updateLocation();
					var option = {
						enableHighAccuracy: true // use GPS as much as possible
					};
					let mapOptions : GoogleMapOptions = {
            'mapType':'MAP_TYPE_ROADMAP',// MAP_TYPE_TERRAIN MAP_TYPE_HYBRID MAP_TYPE_ROADMAP MAP_TYPE_SATELLITE MAP_TYPE_NONE MAP_TYPE_NORMAL
            'controls': {
              'compass': true,
              'myLocationButton': true,
              'indoorPicker': true,
              'zoom': false,
              'myLocation' : true
            },
            'camera': {
              'target': this.location,

              'tilt': 30,
              'zoom': 17,
              'bearing': 150
              },
              'gestures':{
                'tilt': true,
                'zoom': true,
                'rotate' : true
              },
              'preferences': {
                'building':true
              }
            };
            let element = this.mapElement.nativeElement;
	          
	          this.map = this.googleMaps.create(element,mapOptions);
	     
	          this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
	    
            this.user.location.lat = this.location.lat;
            this.user.location.lng = this.location.lng;  

            var animateOption : CameraPosition<any> = {
              target : this.location,
              tilt : 30,
              zoom : 17 ,
              bearing : 150,
              duration : 6000
            };
            
            this.map.animateCamera(animateOption);
            //setTimeout(() => {this.addMarker()}, 2000);
	          }, err => {
	        		alert('mapready\n'+err);
	        	});

				}, err => {
					alert('geoposition\n'+err);
				});


        
		}, err => {
			alert('platformready\n'+err);
		});
  }

  addMarker(bud) {
    if(bud.name == this.user.name)
      return;
    this.map.addMarker({
      title: bud.name,
      
      // animation: 'DROP',
      position: {
        lat: bud.location.lat,
        lng: bud.location.lng
      }
    })
    .then(marker => {
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        
      });
    },
    err=>{
    	alert('marker\n'+err);
    });

    
  }

  updateLocation(){
    try{
        this.firebaseDB.list('/user').set(this.user.username , this.user);
      }
    catch(err)
    {
      alert('updateLocationError'+err);
    }
  }

  loadBuddies()
  {
    this.firebaseDB.list('/user').valueChanges().subscribe(budd=>{
      this.map.clear();
      budd.forEach(item=>{
        
        this.addMarker(item);
      });
      
    });
  }

}

