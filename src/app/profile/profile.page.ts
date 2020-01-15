import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { DatabaseService } from '../database.service';
import { UploadPictureService } from '../uploadpicture.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user;

  constructor(
    public menu: MenuController,
    public loadingController: LoadingController,
    public db: DatabaseService,
    public toastController: ToastController,
    private alertController: AlertController,
    private uploadPicture: UploadPictureService,
  ) { }

  ngOnInit() {
    this.presentLoading();
    
    const userEmail = this.db.userDetails().email;
    this.user = this.db.collection$('userProfile', ref =>
      ref
        .where('email', '==', userEmail)
    );
  }

  ionViewWillEnter() {
    this.menu.enable(true);
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

  async updateName(): Promise<void> {
    const alert = await this.alertController.create({
      subHeader: 'Update first name & last name',
      inputs: [
        {
          type: 'text',
          name: 'firstName',
          placeholder: 'Your first name',
          id: 'firstName'
        },
        {
          type: 'text',
          name: 'lastName',
          placeholder: 'Your last name',
          id: 'lastName'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            this.presentToast("Name and last name not updated!", true, 'bottom', 3000);
          }
        },
        {
          text: 'Save',
          handler: data => {
            const firstName$ = new Subject();
            const lastName$ = new Subject();
            const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
            const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
            firstNameInput.addEventListener('keyup', () => firstName$.next(firstNameInput.value));
            lastNameInput.addEventListener('keyup', () => lastName$.next(lastNameInput.value));
            if (firstNameInput.value && lastNameInput.value) {
              this.db.updateName(data.firstName, data.lastName);
              this.presentToast("Name and last name updated!", true, 'bottom', 3000);
            }
            else {
              this.presentToast("Name and last name not updated!", true, 'bottom', 3000);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async updatePassword(): Promise<void> {
    const alert = await this.alertController.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.db.updatePassword(
              data.newPassword,
              data.oldPassword
            );
          },
        },
      ],
    });
    await alert.present();
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
