import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public appPages = [
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person'
    },
    {
      title: 'Calculator',
      url: '/money',
      icon: 'calculator'
    },
  ];

  user:any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initializeNavigation() {
    this.afAuth.authState.subscribe(( user ) => {
      if( user ) {
        this.appPages = [
          {title: 'Profile' , url: '/profile', icon: 'person'},
          {title: 'Calculator' , url: '/money', icon: 'caculator'},
        ]
        this.user = user;
      }
    })
  }

  signOut() {
    this.afAuth.auth.signOut().then(()=>{
      // redirect user to signin page
      this.router.navigate(['/login'])
    })
  }
}
