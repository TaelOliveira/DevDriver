import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  getDate = new Date();
  user;

  constructor(
    public db: DatabaseService,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.presentLoading();
    
    const userEmail = this.db.userDetails().email;
    this.user = this.db.collection$('userProfile', ref =>
      ref
        .where('email', '==', userEmail)
    );
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

}
