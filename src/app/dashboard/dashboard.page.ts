import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { LoadingController, MenuController } from '@ionic/angular';
import { FireSQL } from 'firesql';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  getDate = new Date();
  user;
  totalEarnings;

  constructor(
    public db: DatabaseService,
    private afs: AngularFirestore,
    public menu: MenuController,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.presentLoading();

    const userEmail = this.db.userDetails().email;
    this.user = this.db.collection$('userProfile', ref =>
      ref
        .where('email', '==', userEmail)
    );

    this.getTotalEarnings();
    this.getTotalExpenses();
    this.getTotalKms();
    this.getTotalProfit();
    this.getAvg();
    this.getTotalDays();
  }

  ionViewWillEnter() {
    this.menu.enable(true);
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

  getTotalEarnings() {
    const fireSQL = new FireSQL(firebase.firestore());
    const userId = this.db.userDetails().uid;

    const sumTotalEarnings = fireSQL.query(`
        SELECT sum(totalEarnings) as TotalEarnings
        FROM items
        WHERE createdBy = '${userId}'
        `);

    sumTotalEarnings.then(items => {
      for (const item of items) {
        console.log(item)
        this.db.updateTotalEarnings(item);
      }
    })
  }

  getTotalExpenses() {
    const fireSQL = new FireSQL(firebase.firestore());
    const userId = this.db.userDetails().uid;

    const sumTotalExpenses = fireSQL.query(`
        SELECT sum(totalExpenses) as TotalExpenses
        FROM items
        WHERE createdBy = '${userId}'
        `);

    sumTotalExpenses.then(items => {
      for (const item of items) {
        console.log(item)
        this.db.updateTotalExpenses(item);
      }
    })
  }

  getTotalProfit() {
    const fireSQL = new FireSQL(firebase.firestore());
    const userId = this.db.userDetails().uid;

    const sumTotalProfit = fireSQL.query(`
        SELECT sum(profit) as TotalProfit
        FROM items
        WHERE createdBy = '${userId}'
        `);

    sumTotalProfit.then(items => {
      for (const item of items) {
        console.log(item)
        this.db.updateTotalProfit(item);
      }
    })
  }

  getTotalKms() {
    const fireSQL = new FireSQL(firebase.firestore());
    const userId = this.db.userDetails().uid;

    const sumTotalKms = fireSQL.query(`
        SELECT sum(kms) as TotalKms
        FROM items
        WHERE createdBy = '${userId}'
        `);

    sumTotalKms.then(items => {
      for (const item of items) {
        console.log(item)
        this.db.updateTotalKms(item);
      }
    })
  }

  getAvg() {
    const fireSQL = new FireSQL(firebase.firestore());
    const userId = this.db.userDetails().uid;

    const avg = fireSQL.query(`
        SELECT AVG(totalEarnings) as AVG
        FROM items
        WHERE createdBy = '${userId}'
        `);

    avg.then(items => {
      for (const item of items) {
        console.log(item)
        this.db.updateAvgEarnings(item);
      }
    })
  }

  getTotalDays() {
    const userId = this.db.userDetails().uid;
    this.afs.collection('items', (ref) => ref
      .where('createdBy', '==', userId))
      .get()
      .subscribe(count => {
        console.log(count.size)
        this.db.updateTotalDays(count.size)
      })
  }

}
