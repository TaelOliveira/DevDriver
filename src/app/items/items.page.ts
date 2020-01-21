import { Component, OnInit } from '@angular/core';
import { ToastController, MenuController, AlertController, LoadingController } from '@ionic/angular';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  items;
  item;
  faCoffee;

  constructor(
    public alertController: AlertController,
    public menu: MenuController,
    public loadingController: LoadingController,
    public db: DatabaseService,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.presentLoading();
    const userId = this.db.userDetails().uid;
    this.items = this.db.collection$('items', ref =>
      ref
        .where('createdBy', '==', userId)
        .orderBy('createdAt', 'desc')
    );
  }

  deleteItem(item){
    if(this.db.delete(`items/${item.id}`)){
      this.presentToast("Item deleted!", false, 'bottom', 3000);
    }
    else{
      this.presentToast("Sorry, try again later!", false, 'bottom', 3000);
    }
    console.log(item.id);
  }

  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: show_button,
      position: position,
      duration: duration
    });
    toast.present();
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
