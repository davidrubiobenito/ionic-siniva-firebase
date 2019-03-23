import { Component } from '@angular/core';
import { NavController, MenuController, AlertController, Platform  } from 'ionic-angular';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet'
import { Toast } from '@ionic-native/toast';

import { AuthService } from '../../services/auth.service';

/* Pages */
import { LoginPage } from '../login/login';
import { ListProductPage } from '../product/list-product/list-product';
import { ListNotePage } from '../note/list-note/list-note';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public pages: Array<{icon: string, title: string, component: any}>;
  public listProductPage: any;
  public listNotePage: any;

  public constructor( public navCtrl: NavController, 
                      public menuCtrl: MenuController, 
                      private actionSheet: ActionSheet,
                      private toast: Toast,
                      public alertCtrl: AlertController,
                      public platform : Platform,
                      public auth: AuthService) {
    
   
    // used for an example of ngFor and navigation
    this.pages = [
      { icon: 'trending-up', title: 'Lista Producto', component: ListProductPage },
      { icon: 'create', title: 'Lista Notas', component: ListNotePage }
    ];

    // Push Page
    this.listProductPage = ListProductPage;
    this.listNotePage = ListNotePage;
  }

  showMenu() {
    this.menuCtrl.open('filtersmenu');
  }

  hideMenu() {
    this.menuCtrl.close('filtersmenu');
  }

  login() {
    this.menuCtrl.close();
	  this.auth.signOut();
	  this.navCtrl.setRoot(LoginPage);
  }

  logout() {
	  this.menuCtrl.close();
	  this.auth.signOut();
	  this.navCtrl.setRoot(LoginPage);
  }

  presentActionSheet() {
    let buttonLabels = ['Lista Productos', 'Lista Notas', 'Salir Aplicación', 'Creditos'];
    const options: ActionSheetOptions = {
      title: 'Opciones ...',
      subtitle: 'Elige una opción',
      buttonLabels: buttonLabels,
      addCancelButtonWithLabel: 'Cancelar',
      androidTheme: 3,
      destructiveButtonLast: false,
      androidEnableCancelButton: true
    };

    this.actionSheet.show(options).then((buttonIndex: number) => {
      console.log('Button pressed: ' + buttonIndex);
      switch(buttonIndex){
        case 1:
          this.goToListProduct();
        break;
        case 2:
          this.goToListNote();
        break;
        case 3:
          this.platform.exitApp();
        break;
        case 4:
          this.presentToast('David Rubio Benito', 'short', 'bottom');
        break;
      }
    });

  }
    
  presentToast(message: string, duration: string, position: string) {
    this.toast.show(message, duration, position).subscribe(
      toast => {
        console.log(toast);
    });
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

  /************** */
  ionViewDidLoad(){
    //console.log('ionViewDidLoad LoginPage');            
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'filtersmenu');
  }

}
