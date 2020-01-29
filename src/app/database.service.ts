import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  public userProfile: firebase.firestore.DocumentReference;
  public currentUser: firebase.User;

  constructor(
    private afs:AngularFirestore,
    public toastController: ToastController,
  ) { 
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.firestore().doc(`/userProfile/${user.uid}`);
      }
    });
    this.currentUser = firebase.auth().currentUser;
    this.userProfile = firebase.firestore().doc(`/userProfile/${this.currentUser}`);
  }

  collection$(path, query?){
    return this.afs
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data:Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
      );
  }

  doc$(path):Observable<any>{
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return {id:doc.payload.id, ...doc.payload.data};
        })
      );
  }

  updateAt(path: string, data: Object): Promise<any>{
    const segments = path.split('/').filter(v => v);
    if(segments.length % 2){
      //odd is always a collection
      return this.afs.collection(path).add(data);
    }
    else{
      //even is always document
      return this.afs.doc(path).set(data, {merge: true});
    }
  }

  delete(path){
    return this.afs.doc(path).delete();
  }

  userDetails(){
    return firebase.auth().currentUser;
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

  updateName(firstName: string, lastName: string): Promise<any> {
    return this.userProfile.update({ firstName, lastName });
  }

  updateCar(carMake: string, carModel: string, carYear: string): Promise<any> {
    return this.userProfile.update({ carMake, carModel, carYear });
  }

  updatePhotoURL(photoURL: string){
    return this.userProfile.update({ photoURL });
  }

  updateCarURL(carURL: string){
    return this.userProfile.update({ carURL });
  }

  updatePassword(newPassword: string, oldPassword: string): Promise<any> {
    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oldPassword
    );
  
    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(() => {
        this.currentUser.updatePassword(newPassword).then(() => {
          console.log('Password Changed');
          this.presentToast('Password updated', true, 'bottom', 3000);
        });
      })
      .catch(error => {
        console.error(error);
        this.presentToast('Password not updated', false, 'bottom', 3000);
      });
  }

}
