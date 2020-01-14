import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  private signUpForm: FormGroup;

  constructor(
    private modal:ModalController,
    private formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email ] ],
      password: ['', [Validators.required, Validators.minLength(6) ] ]
    });
  }

  submit() {
    this.modal.dismiss({
      email: this.signUpForm.controls.email.value,
      password: this.signUpForm.controls.password.value
    });
  }

  close() {
    this.modal.dismiss();
  }
}
