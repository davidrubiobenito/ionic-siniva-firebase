import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController, Navbar, AlertController, Platform, ActionSheetController, ToastController } from 'ionic-angular';

import { Observable } from 'rxjs';

import { ProductListService } from '../../../services/product-list.service';
import { AuthService } from '../../../services/auth.service';

/* Pages */
import { HomePage } from '../../home/home';
import { AddProductPage } from '../../product/add-product/add-product';
import { EditProductPage } from '../../product/edit-product/edit-product';
import { AllProductPage } from '../../product/all-product/all-product';

import { Product } from './../../../model/product/product.model';

@Component({
  selector: 'page-list-product',
  templateUrl: 'list-product.html'
})
export class ListProductPage {
  @ViewChild(Navbar) navBar: Navbar;

  public pages: Array<{icon: string, title: string, component: any}>;
  public addProductPage: any;
  public editProductPage: any;
  public allProductPage: any;
  public productList: Observable<Product[]>;  
  public totalAmountFinalList: number = 0;

  public showLoading: boolean;

  public productListServiceSubscribe;

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
      { icon: 'add', title: 'Añadir Producto', component: AllProductPage }
    ];

    // Push Page
    this.addProductPage = AddProductPage;
    this.editProductPage = EditProductPage;
    this.allProductPage = AllProductPage;
  }

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
        }
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
            this.productListService.removeProductToUserUid(product, this.auth.getUserUid()).then(() => {
              this.presentToast('Producto borrado', 3000, 'bottom');
            });  
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
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
            this.productListService.removeListProduct(this.auth.getUserUid()).then(() => {
              this.presentToast('Lista Borrada', 3000, 'bottom');
            });
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
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
    });

    toast.present();
  }

  //Method to override the default back button action
  setBackButtonAction():void{
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.productListServiceSubscribe.unsubscribe();
      this.navCtrl.setRoot(HomePage);
    }
  }

  /************** */
  ionViewDidLoad(): void{
    console.log('ionViewDidLoad ListProductPage');    
  }

  ionViewWillEnter() : void {
    console.log("ionViewWillEnter ListProductPage");
    this.showLoading=true;
    this.productListServiceSubscribe = this.productListService.getProductListToUserUid(this.auth.getUserUid()).snapshotChanges().subscribe(
      (result) => {
        this.showLoading=false;
        this.productList = this.processData(result);
        this.totalAmountFinalListProduct(this.productList);        
      },
      (err) => {
        console.log('problema', err);
        this.showLoading=false;
      },
      () => {
        console.log("completed");
        this.showLoading=false;
      }
    ); 

    this.setBackButtonAction();
  }

  ionViewDidEnter() : void{
    console.log('ionViewDidEnter ListProductPage');   
    this.menuCtrl.enable(true, 'filtersproduct');    
  }

}
