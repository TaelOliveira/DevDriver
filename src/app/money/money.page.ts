import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, MenuController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../database.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-money',
  templateUrl: './money.page.html',
  styleUrls: ['./money.page.scss'],
})
export class MoneyPage implements OnInit {

  calculationForm: FormGroup;
  day;
  kms;
  hours;
  earnings;
  petrol;
  tolls;
  other;
  date;
  totalExpenses;
  totalEarnings;
  avgEarnings;

  constructor(
    public alertController: AlertController,
    public menu: MenuController,
    public db: DatabaseService,
    public toastController: ToastController,
    private decimalPipe: DecimalPipe,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.calculationForm = this.formBuilder.group({
      kms: ['', Validators.required],
      hours: ['', Validators.required],
      earnings: ['', Validators.required],
      petrol: ['', Validators.required],
      tolls: ['', Validators.required],
      other: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  async showOnScreen(){

    this.kms = this.calculationForm.value['kms'];
    this.hours = this.calculationForm.value['hours'];
    this.earnings = this.calculationForm.value['earnings'];
    this.petrol = this.calculationForm.value['petrol'];
    this.tolls = this.calculationForm.value['tolls'];
    this.other = this.calculationForm.value['other'];
    this.date = this.calculationForm.value['date'];

    if(this.kms <= 0){
      this.presentToast("Total kms cannt be empty or less than 0!", true, 'bottom', 3000);
    }
    if(this.hours <= 0){
      this.presentToast("Total kms cannt be empty or less than 0!", true, 'bottom', 3000);
    }
    if(this.earnings <= 0){
      this.presentToast("Total kms cannt be empty or less than 0!", true, 'bottom', 3000);
    }
    if(this.tolls < 0){
      this.tolls = 0;
    }
    if(this.other < 0){
      this.other = 0;
    }

    this.totalExpenses = this.decimalPipe.transform((this.petrol + this.tolls + this.other), '1.2-2');
    this.totalEarnings = this.decimalPipe.transform((this.earnings - this.totalExpenses), '1.2-2');
    this.avgEarnings = this.decimalPipe.transform((this.totalEarnings / this.hours), '1.2-2');

    const alert = await this.alertController.create({
      header: 'Your Earnings',
      message: 'Total Expenses: $' + this.totalExpenses + '<br/>' + 'Total Earnings: $' + this.totalEarnings + '<br/>' + 'Average Earnings: $' + this.avgEarnings + '/hour',
      cssClass: "myAlert",
      animated: true,
      buttons: ['OK']
    });

    await alert.present();

  }

  async addToList(){
    const id = this.day ? this.day.id : '';
    const data = {
      createdAt: this.date,
      createdBy: this.db.currentUser.uid,
      kms: this.kms,
      hours: this.hours,
      totalExpenses: this.totalExpenses,
      totalEarnings: this.totalEarnings,
      avgEarnings: this.avgEarnings
    };

    this.db.updateAt(`day/${id}`, data);
    this.presentToast("Added!", true, 'bottom', 3000);
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
