import { Product } from './../../model/product/product.model';
import { Component } from '@angular/core';
import { NavController, MenuController, AlertController, Platform  } from 'ionic-angular';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet'
import { Toast } from '@ionic-native/toast';

import { Observable } from 'rxjs';
//import { map, filter, switchMap } from 'rxjs/operators';

import { ProductListService } from '../../services/product-list.service';
import { AuthService } from '../../services/auth.service';

/* Pages */
import { LoginPage } from '../login/login';
import { AddProductPage } from '../add-product/add-product';
import { EditProductPage } from '../edit-product/edit-product';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public pages: Array<{icon: string, title: string, component: any}>;
  public addProductPage: any;
  public editProductPage: any;
  public productList: Observable<Product[]>;  
  //public productListAux: Product[];

  public constructor( public navCtrl: NavController, 
                      public menuCtrl: MenuController, 
                      private actionSheet: ActionSheet,
                      private toast: Toast,
                      public alertCtrl: AlertController,
                      public platform : Platform,
                      private productListService: ProductListService, 
                      public auth: AuthService) {
    
   
    // used for an example of ngFor and navigation
    this.pages = [
      { icon: 'add', title: 'Añadir Producto', component: AddProductPage }
    ];

    // Push Page
    this.addProductPage = AddProductPage;
    this.editProductPage = EditProductPage;
  }

  showMenu() {
    this.menuCtrl.open('filters1');
  }

  hideMenu() {
    this.menuCtrl.close('filters1');
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

  processData(input: any): Observable<Product[]>{     
    let resultAux = input.map(ch => ({key: ch.key, ...ch.payload.val()}));
    return resultAux;
  }

  removeProduct(product: Product) {
    this.showPrompt(product);       
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: 'Producto borrado correctamente',
      buttons: [{text: 'Aceptar', cssClass:"button-secundary"}],
      cssClass: 'dialogCustomCss'
    });
    alert.present();
  }

  presentActionSheet() {
    let buttonLabels = ['Salir Aplicación', 'Creditos'];
    const options: ActionSheetOptions = {
      title: 'Opciones ...',
      subtitle: 'Elige una opción',
      buttonLabels: buttonLabels,
      addCancelButtonWithLabel: 'Cancelar',
      addDestructiveButtonWithLabel: 'Borrar Lista',
      androidTheme: 3,
      destructiveButtonLast: false,
      androidEnableCancelButton: true
    };

    this.actionSheet.show(options).then((buttonIndex: number) => {
      console.log('Button pressed: ' + buttonIndex);
      switch(buttonIndex){
        case 1:
          this.showPromptBorrarList();
        break;
        case 2:
          this.platform.exitApp();
        break;
        case 3:
          this.presentToast('David Rubio Benito', 'short', 'bottom');
        break;
      }
    });

  }

  showPrompt(product : Product) {
    const prompt = this.alertCtrl.create({
      title: '¿Borrar Producto?',
      message: "Producto <span class='text-prin' >' " + product.title + " '</span>",      
      buttons: [        
        {
          text: 'Aceptar',
          handler: data => {
            console.log('Saved clicked');
            this.productListService.removeProductToUserUid(product, this.auth.getUserUid()).then(() => {
              this.presentToast('Producto borrado', 'short', 'bottom');
              //this.navCtrl.setRoot(HomePage);
            });  
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          },
          cssClass: 'button-primary'
        },
      ],
      cssClass: 'dialogCustomCss'
    });
    prompt.present();
  }

  showPromptBorrarList() {
    const prompt = this.alertCtrl.create({
      title: 'Borrar Lista',
      message: "¿Desea BORRAR TODOS los Productos de la Lista?",      
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancelar clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            console.log('Aceptar clicked');
            this.productListService.removeListProduct(this.auth.getUserUid()).then(() => {
              this.presentToast('Lista Borrada', 'short', 'bottom');
              //this.navCtrl.setRoot(HomePage);
            });
          }
        }
      ]
    });
    prompt.present();
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

  /************** */
  ionViewDidLoad(){
    //console.log('ionViewDidLoad LoginPage');        
    this.productListService.getProductListToUserUid(this.auth.getUserUid()).snapshotChanges().subscribe(
      (result) => {
        this.productList = this.processData(result);
      },
      (err) => {
        console.log('problema', err);
      },
      () => {
        console.log("completed");
      }
    );  
    
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'filters1');
  }

}
