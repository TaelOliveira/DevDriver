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
  minutes;
  earnings1;
  earnings2;
  earnings3;
  petrol;
  tolls;
  other;
  date;
  totalExpenses;
  totalEarnings;
  avgEarnings;
  totalHours;
  profit;

  validations = {
    'kms': [
      { type: 'min', message: 'Total kms vannot be less than 0.' }
    ],
    'hours': [
      { type: 'maxlength', message: 'Hours cannot be more than 2 characters long.' },
      { type: 'max', message: 'Hours cannot be more than 24.' },
      { type: 'min', message: 'Hours cannot be less than 0.' }
    ],
    'minutes': [
      { type: 'maxlength', message: 'Minutes cannot be more than 2 characters long.' },
      { type: 'max', message: 'Minutes cannot be more than 59.' },
      { type: 'min', message: 'Minutes cannot be less than 0.' }
    ],
    'earnings1': [
      { type: 'min', message: 'Earnings cannot be less than 0.' }
    ],
    'earnings2': [
      { type: 'min', message: 'Earnings cannot be less than 0.' }
    ],
    'earnings3': [
      { type: 'min', message: 'Earnings cannot be less than 0.' }
    ],
    'petrol': [
      { type: 'min', message: 'Petrol cannot be less than 0.' }
    ],
    'tolls': [
      { type: 'min', message: 'Tolls cannot be less than 0.' }
    ],
    'other': [
      { type: 'min', message: 'Other cannot be less than 0.' }
    ],
  };

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
      kms: ['', [Validators.required, Validators.min(0)]],
      hours: ['', [Validators.required, Validators.maxLength(2), Validators.max(24), Validators.min(0)]],
      minutes: ['', [Validators.required, Validators.maxLength(2), Validators.max(59), Validators.min(0)]],
      earnings1: ['', [Validators.required, Validators.min(0)]],
      earnings2: ['', [Validators.required, Validators.min(0)]],
      earnings3: ['', [Validators.required, Validators.min(0)]],
      petrol: ['', [Validators.required, Validators.min(0)]],
      tolls: ['', [Validators.required, Validators.min(0)]],
      other: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
    });
  }


  async showOnScreen() {

    this.kms = this.calculationForm.value['kms'];
    this.hours = this.calculationForm.value['hours'];
    this.minutes = this.calculationForm.value['minutes'];
    this.earnings1 = this.calculationForm.value['earnings1'];
    this.earnings2 = this.calculationForm.value['earnings2'];
    this.earnings3 = this.calculationForm.value['earnings3'];
    this.petrol = this.calculationForm.value['petrol'];
    this.tolls = this.calculationForm.value['tolls'];
    this.other = this.calculationForm.value['other'];
    this.date = this.calculationForm.value['date'];

    this.totalHours = this.decimalPipe.transform((this.hours + (this.minutes / 60)), '1.2-2');

    this.totalEarnings = this.decimalPipe.transform( (this.earnings1 + this.earnings2 + this.earnings3), '1.2-2');
    this.totalExpenses = this.decimalPipe.transform( (this.petrol + this.tolls + this.other), '1.2-2');
    this.profit = this.decimalPipe.transform( (this.totalEarnings - this.totalExpenses), '1.2-2');
    
    this.avgEarnings = this.decimalPipe.transform((this.totalEarnings / this.totalHours), '1.2-2');

    const alert = await this.alertController.create({
      header: 'Your Day Summary',
      message: 'Total Earnings: $' + this.totalEarnings + '<br/>' +
                'Total Expenses: $' + this.totalExpenses + '<br/>' +
                'Profit: $' + this.profit + '<br/>' +
                'Average Earnings: $' + this.avgEarnings + '/hour',
      cssClass: "myAlert",
      animated: true,
      buttons: ['OK']
    });

    await alert.present();

  }

  async addToList() {
    const id = this.day ? this.day.id : '';
    const data = {
      createdAt: this.date,
      createdBy: this.db.currentUser.uid,
      kms: this.kms,
      hours: this.hours + 'h ' + this.minutes + 'min',
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
