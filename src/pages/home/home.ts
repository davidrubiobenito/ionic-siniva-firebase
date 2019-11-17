import { Component } from '@angular/core';
import { NavController, MenuController, AlertController, Platform, App  } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';

import { ActionSheetController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

/* Pages */
import { LoginPage } from '../login/login';
import { ListProductPage } from '../product/list-product/list-product';
import { ListNotePage } from '../note/list-note/list-note';
import { ListYearPage } from '../year/list-year/list-year';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public pages: Array<{icon: string, title: string, component: any}>;

  public constructor( public navCtrl: NavController, 
                      public menuCtrl: MenuController, 
                      public alertCtrl: AlertController,
                      public platform : Platform,
                      public auth: AuthService,
                      public actionSheetCtrl: ActionSheetController,
                      public toastCtrl: ToastController,
                      public app: App) {
  }

  
  login() {
	  this.auth.signOut();
	  this.navCtrl.setRoot(LoginPage);
  }

  logout() {
    this.auth.signOut().then(authData => {
      this.navCtrl.setRoot(LoginPage);
    })
  }
 
  presentActionSheet() {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones ...',
      buttons: [        
       {
          text: this.auth.getEmail(),
          icon: 'mail'
        }, 
       {
          text: 'Cerrar Sesión',
          icon: 'log-out',
          handler: () => {
            this.logout();
          }
        },  
        {
          text: 'Salir Aplicación',
          icon: 'power',
          handler: () => {
            this.platform.exitApp();
          }
        },       
        {
          text: 'Creditos',
          icon: 'information',
          handler: () => {
            this.presentToast('David Rubio Benito', 6000, 'bottom');
          }
        }
      ],
      enableBackdropDismiss: true
    });

    actionSheet.present();
  }

  presentToast(message: string, duration: number, position: string) {
    let toast = this.toastCtrl.create({ 
      message: message,
      duration: duration,
      position: position,
      dismissOnPageChange: true,
      cssClass: 'toast'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  exitApp(){
    this.platform.exitApp();
  }

  goToListProduct(){
    this.navCtrl.push(ListProductPage);
  }

  goToListNote(){
    this.navCtrl.push(ListNotePage);
  }

  goToListExpense(){
    this.navCtrl.push(ListYearPage);
  }

  /************** */
  ionViewDidLoad(): void{
    console.log('ionViewDidLoad HomePage');            
  }

  ionViewWillEnter() : void {
    console.log("ionViewWillEnter HomePage");
  }

  ionViewDidEnter(): void{
    console.log('ionViewDidEnter HomePage');    
  }

}
