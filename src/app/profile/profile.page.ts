import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { DatabaseService } from '../database.service';
import { UploadPictureService } from '../uploadpicture.service';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user;
  carMakeForm: FormGroup;
  carModelForm: FormGroup;
  carYearForm: FormGroup;
  carMake;
  carModel;
  carYear;

  carURL= {
    cerato: "https://firebasestorage.googleapis.com/v0/b/devdriver-7b9c2.appspot.com/o/car%2Fcerato.jpg?alt=media&token=b378592f-8000-447e-9298-765cf9e3d5f2",
    sportage: "https://firebasestorage.googleapis.com/v0/b/devdriver-7b9c2.appspot.com/o/car%2Fsportage.jpg?alt=media&token=edbba6d5-e2d8-47fa-bee0-e7c5267d22ab",
    asx: "https://firebasestorage.googleapis.com/v0/b/devdriver-7b9c2.appspot.com/o/car%2FASX.jpg?alt=media&token=70b8d7bd-e1c4-4d13-bf71-af4fb8edf743",
    camry: "https://firebasestorage.googleapis.com/v0/b/devdriver-7b9c2.appspot.com/o/car%2Fcamry.jpg?alt=media&token=cd54810d-1d7b-4ee3-9839-282c0b783966",
    corolla: "https://firebasestorage.googleapis.com/v0/b/devdriver-7b9c2.appspot.com/o/car%2Fcorolla.jpg?alt=media&token=203970fa-2ffb-4dcb-8005-b07b0ff6c693",
    outlander: "https://firebasestorage.googleapis.com/v0/b/devdriver-7b9c2.appspot.com/o/car%2Foutlander.png?alt=media&token=0ffa1b79-8c32-444d-a5ed-a269992860ad"
  }

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

    this.carMakeForm = new FormGroup({
      carMake: new FormControl('', Validators.required)
    });
    this.carModelForm = new FormGroup({
      carModel: new FormControl('', Validators.required)
    });
    this.carYearForm = new FormGroup({
      carYear: new FormControl('', Validators.required)
    });
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

  getCarMake() {
    this.carMake = this.db.collection$('carMake', ref =>
      ref
        .orderBy('carMake', 'desc')
    );
  }

  getCarModel() {
    const make = this.carMakeForm.value['carMake'];
    this.carModel = this.db.collection$(make, ref =>
      ref
        .orderBy('name', 'desc')
    );
  }

  getYear() {
    this.carYear = this.db.collection$('carYear', ref =>
      ref
        .orderBy('carYear', 'desc')
    );
  }

  async updateCar(): Promise<void> {
    const carMake = this.carMakeForm.value['carMake'];
    const carModel = this.carModelForm.value['carModel'];
    const carYear = this.carYearForm.value['carYear'];

    if (this.db.updateCar(carMake, carModel, carYear)) {
      if(carModel == "Cerato"){
        this.db.updateCarURL( this.carURL.cerato );
      }
      if(carModel == "Sportage"){
        this.db.updateCarURL( this.carURL.sportage );
      }
      if(carModel == "Outlander"){
        this.db.updateCarURL( this.carURL.outlander );
      }
      if(carModel == "ASX"){
        this.db.updateCarURL( this.carURL.asx );
      }
      if(carModel == "Corolla"){
        this.db.updateCarURL( this.carURL.corolla );
      }
      if(carModel == "Camry"){
        this.db.updateCarURL( this.carURL.camry );
      }
      this.presentToast("Car updated!", true, 'bottom', 3000);
      this.carMakeForm.reset();
      this.carModelForm.reset();
      this.carYearForm.reset();
    }
    else {
      this.presentToast("Car not updated!", true, 'bottom', 3000);
    }
  }

  cleanForm() {
    this.carMakeForm.reset();
    this.carModelForm.reset();
    this.carYearForm.reset();
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
