import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, MenuController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../database.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})

export class CalculatorPage implements OnInit {

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
  dateFormat;

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

    this.kms = parseFloat(this.calculationForm.value['kms']);
    this.hours = this.calculationForm.value['hours'];
    this.minutes = this.calculationForm.value['minutes'];
    this.earnings1 = this.calculationForm.value['earnings1'];
    this.earnings2 = this.calculationForm.value['earnings2'];
    this.earnings3 = this.calculationForm.value['earnings3'];
    this.petrol = this.calculationForm.value['petrol'];
    this.tolls = this.calculationForm.value['tolls'];
    this.other = this.calculationForm.value['other'];
    this.date = this.calculationForm.value['date'];
    this.dateFormat = this.date.split('T')[0];

    this.totalHours = this.decimalPipe.transform((this.hours + (this.minutes / 60)), '1.2-2');

    this.totalEarnings = parseFloat(this.decimalPipe.transform((this.earnings1 + this.earnings2 + this.earnings3), '1.2-2'));
    this.totalExpenses = parseFloat(this.decimalPipe.transform((this.petrol + this.tolls + this.other), '1.2-2'));
    this.profit = parseFloat(this.decimalPipe.transform((this.totalEarnings - this.totalExpenses), '1.2-2'));
    this.avgEarnings = parseFloat(this.decimalPipe.transform((this.totalEarnings / this.totalHours), '1.2-2'));

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
    console.log(this.kms);
    console.log(this.dateFormat);
    console.log(this.earnings1);
    const id = this.day ? this.day.id : '';
    const data = {
      createdAt: this.dateFormat,
      createdBy: this.db.currentUser.uid,
      kms: this.kms,
      hours: this.hours + 'h ' + this.minutes + 'min',
      totalExpenses: this.totalExpenses,
      totalEarnings: this.totalEarnings,
      avgEarnings: this.avgEarnings,
      profit: this.profit
    };

    this.db.updateAt(`items/${id}`, data);
    this.presentToast("Item added!", true, 'bottom', 3000);
    this.calculationForm.reset();
  }

  async showCalculations() {
    const alert = await this.alertController.create({
      header: 'How it is done',
      message: '<strong>' + 'Total Earnings:' + '</strong><br/>' +
                'earnings1 + earnings2 + earnings3' + '<br/><br/>' +
                '<strong>' + 'Total Expenses:' + '</strong><br/>' +
                'petrol + tolls + other' + '<br/><br/>' +
                '<strong>' + 'Profit:' + '</strong><br/>' +
                'Total Earnings - Total Expenses' + '<br/><br/>' +
                '<strong>' + 'Average Earnings:' + '</strong><br/>' +
                'Total Earnings / Total Hours' + '<br/>',
      cssClass: "myAlert",
      animated: true,
      buttons: ['OK']
    });

    await alert.present();
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
