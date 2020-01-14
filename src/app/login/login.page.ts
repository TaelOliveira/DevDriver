import { Component, OnInit } from '@angular/core';

import { ModalController, ToastController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RegisterPage } from '../register/register.page';

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
        this.router.navigate(['/profile']);
      })
      .catch((error) => {
        console.log(error)
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
          .then((userData) => {
            // sign up successful
            this.router.navigate(['/profile']);
          })
          .catch((error) => {
            // handle errors
          })
      }
    })
    await signUpModal.present();
  }

}
