import { Component, OnInit } from '@angular/core';

import { ModalController, ToastController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RegisterPage } from '../register/register.page';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  signInForm: FormGroup;

  constructor(
    private modal: ModalController,
    private auth: AuthService,
    private router: Router,
    public menu: MenuController,
    public toastController: ToastController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  signIn() {
    const email = this.signInForm.controls.email.value;
    const password = this.signInForm.controls.password.value;
    this.auth.signIn(email, password)
      .then((response) => {
        this.signInForm.reset();
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        console.log(error)
        this.presentToast(error.message, true, 'bottom', 3000);
      })
  }

  async register() {
    const signUpModal = await this.modal.create({
      component: RegisterPage
    });
    signUpModal.onDidDismiss().then((response) => {
      if (response.data) {
        //handle signup response
        const email = response.data.email;
        const password = response.data.password;
        this.auth.signUp(email, password)
        .then((newUserCredential: firebase.auth.UserCredential) => {
          firebase
            .firestore()
            .doc(`/userProfile/${newUserCredential.user.uid}`)
            .set({'email': email});
        })
          .then(async (userData) => {
            // sign up successful
            await this.presentToast("Your account has been created!", true, 'bottom', 3000);
          })
          .catch(async (error) => {
            await this.presentToast(error.message, true, 'bottom', 3000);
          })
      }
    })
    await signUpModal.present();
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

}
