import { Component } from '@angular/core';
import { NavController, MenuController, AlertController, Platform  } from 'ionic-angular';

import { Observable } from 'rxjs';
//import { map, filter, switchMap } from 'rxjs/operators';

import { ActionSheetController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ProductListService } from '../../../services/product-list.service';
import { AuthService } from '../../../services/auth.service';

/* Pages */
//import { LoginPage } from '../../login/login';
//import { HomePage } from '../../home/home';
import { AddProductPage } from '../../product/add-product/add-product';
import { EditProductPage } from '../../product/edit-product/edit-product';
import { AllProductPage } from '../../product/all-product/all-product';

import { Product } from './../../../model/product/product.model';

@Component({
  selector: 'page-list-product',
  templateUrl: 'list-product.html'
})
export class ListProductPage {

  public pages: Array<{icon: string, title: string, component: any}>;
  public addProductPage: any;
  public editProductPage: any;
  public allProductPage: any;
  public productList: Observable<Product[]>;  
  //public productListAux: Product[];
  public totalAmountFinalList: number = 0;

  public showLoading: boolean;

  public constructor( public navCtrl: NavController, 
                      public menuCtrl: MenuController, 
                      public alertCtrl: AlertController,
                      public platform : Platform,
                      private productListService: ProductListService, 
                      public auth: AuthService,
                      public actionSheetCtrl: ActionSheetController,
                      public toastCtrl: ToastController) {
    
   
    // used for an example of ngFor and navigation
    this.pages = [
      //{ icon: 'add', title: 'Añadir Producto', component: AddProductPage }
      { icon: 'add', title: 'Añadir Producto', component: AllProductPage }
    ];

    // Push Page
    this.addProductPage = AddProductPage;
    this.editProductPage = EditProductPage;
    this.allProductPage = AllProductPage;
  }

  /*
  showMenu() {
    this.menuCtrl.open('filtersproduct');
  }

  hideMenu() {
    this.menuCtrl.close('filtersproduct');
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
  */

  processData(input: any): Observable<Product[]>{     
    let resultAux = input.map(ch => ({key: ch.key, ...ch.payload.val()}));
    return resultAux;
  }

  totalAmountFinalListProduct(input: any){
    var amountFinal: number = 0;
    for(var i=0; i<input.length; i++){
      amountFinal = amountFinal + Number.parseFloat(input[i].amountFinal);
    }
    this.totalAmountFinalList = amountFinal;
  }

  removeProduct(product: Product) {
    this.showPrompt(product);       
  }

  presentActionSheet() {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones ...',
      buttons: [
        {
          text: 'Borrar Lista Productos',
          icon: 'trash',
          handler: () => {
            this.showPromptBorrarList();
          },
          role: 'destructive'
        },
        /*
        {
          text: 'Salir Aplicación',
          icon: 'log-out',
          handler: () => {
            this.platform.exitApp();
          }
        },   
        {
          text: 'Creditos',
          icon: 'information',
          handler: () => {
            this.presentToast('David Rubio Benito', 3000, 'bottom');
          }
        }
        */
      ],
      enableBackdropDismiss: true
    });

    actionSheet.present();
  }


  showPrompt(product : Product) {
    const prompt = this.alertCtrl.create({
      title: '¿Borrar Producto?',
      message: "Producto <span class='text-prin' >' " + product.name + " '</span>",      
      buttons: [        
        {
          text: 'Borrar',
          handler: data => {
            //console.log('Saved clicked');
            this.productListService.removeProductToUserUid(product, this.auth.getUserUid()).then(() => {
              this.presentToast('Producto borrado', 3000, 'bottom');
              //this.navCtrl.setRoot(HomePage);
            });  
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
            //console.log('Cancel clicked');
          },
          cssClass: 'button-primary'
        },
      ]
    });
    prompt.present();
  }

  showPromptBorrarList() {
    const prompt = this.alertCtrl.create({
      title: 'Borrar Lista',
      message: "¿Desea BORRAR TODOS los Productos de la Lista?",      
      buttons: [
        {
          text: 'Borrar',
          handler: data => {
            //console.log('Aceptar clicked');
            this.productListService.removeListProduct(this.auth.getUserUid()).then(() => {
              this.presentToast('Lista Borrada', 3000, 'bottom');
              //this.navCtrl.setRoot(HomePage);
            });
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
            //console.log('Cancelar clicked');
          },
          cssClass: 'button-primary'
        }
      ]
    });
    prompt.present();
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
      //console.log('Dismissed toast');
    });

    toast.present();
  }

  /*
  exitApp(){
    this.platform.exitApp();
  }g

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }
  */

  /************** */
  ionViewDidLoad(){
    this.showLoading=true;
    //console.log('ionViewDidLoad LoginPage');        
    this.productListService.getProductListToUserUid(this.auth.getUserUid()).snapshotChanges().subscribe(
      (result) => {
        this.showLoading=false;
        this.productList = this.processData(result);
        this.totalAmountFinalListProduct(this.productList);
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
    this.menuCtrl.enable(true, 'filtersproduct');
  }

}
