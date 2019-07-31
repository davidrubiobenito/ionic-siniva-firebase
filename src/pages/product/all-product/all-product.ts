import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Navbar, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Product } from '../../../model/product/product.model';
import { ProductListService } from '../../../services/product-list.service';
import { AuthService } from '../../../services/auth.service';

import { ListProductPage } from '../list-product/list-product';

import { VALIDATION_MESSAGES } from '../../../validators/form';
import { ProductFieldsValidator } from '../../../validators/productfields';

@Component({
  selector: 'page-all-product',
  templateUrl: 'all-product.html'
})
export class AllProductPage {
  @ViewChild(Navbar) navBar: Navbar;

  public action: String;
  public onlyRead: boolean;
  public showButtonCalculate: boolean;

  public disabledButtonCalculate: boolean = false;
  public showFieldsFinal: boolean;

  public showButtonsEditClearFields: boolean;
  public showButtonsDeleteAndUpdate: boolean;
  public showButtonAccept: boolean;
  public showButtonAdd: boolean;

  public product: Product = {
    name: '',
    units: undefined,
    price:'',
    tax:'',
    priceFinal: '',
    amountFinal: ''
  };

  public productTemp: Product = {
    name: '',
    units: undefined,
    price:'',
    tax:'',
    priceFinal: '',
    amountFinal: ''
  };

  public addProductForm: FormGroup;
  public addProductError: string;
  public validationMessages: any;
  
  public constructor( public navCtrl: NavController, 
                      public navParams: NavParams, 
                      private productListService: ProductListService, 
                      private auth: AuthService,
                      private fb: FormBuilder,
                      public alertCtrl: AlertController,
                      public toastCtrl: ToastController) {   
    
    this.validationMessages = VALIDATION_MESSAGES;   

    this.addProductForm = this.fb.group({
      nameproduct:['', Validators.compose([Validators.required])],
        //units:['', Validators.compose([Validators.required,  Validators.pattern("^[1-9][0-9]*$"), Validators.min(0) ])],
      units:['', Validators.compose([Validators.required,  ProductFieldsValidator.isValidUnits, Validators.min(0) ])],
        //price:['', Validators.compose([Validators.required,  Validators.pattern("(^(0|([1-9][0-9]*))(\.[0-9]{1,2})?$)|(^(0{0,1}|([1-9][0-9]*))(\.[0-9]{1,2})?$)"), Validators.min(0) ])],
      price:['', Validators.compose([Validators.required,  ProductFieldsValidator.isValidPrice, Validators.min(0) ])],        
      //esta opción es de prueba
      //price:['', Validators.compose([Validators.required,  Validators.pattern("^(?!^0\.00$)(([1-9][0-9]*)|([0]))\.[0-9]{1,2}$"), Validators.min(0) ])],
        //tax:['', Validators.compose([Validators.required,  Validators.pattern("(^(0|([1-9][0-9]*))?$)"), Validators.min(0), Validators.max(100) ])]
      tax:['', Validators.compose([Validators.required, ProductFieldsValidator.isValidTax, Validators.min(0), Validators.max(100) ])]
    });

  }

  addProduct(product: Product){
    this.productListService.addProductToUserUid(product, this.auth.getUserUid()).then(ref => {
      //this.navCtrl.setRoot(ListProductPage);
      this.navCtrl.popTo(ListProductPage);
    });
  }

  updateProduct(product: Product){    
    this.productListService.updateProductToUserUid(product, this.auth.getUserUid()).then(() =>{
      //this.navCtrl.setRoot(ListProductPage);
      this.navCtrl.popTo(ListProductPage);
    });
  }


  removeProduct(product: Product) {
    this.showPromptDelete(product);
    /*
    this.productListService.removeProductToUserUid(product, this.auth.getUserUid()).then(() => {
      this.navCtrl.popTo(ListProductPage);
    });
    */
  }

  back(){
    //this.navCtrl.setRoot(ListProductPage);
    this.navCtrl.popTo(ListProductPage);
  }

  calculatePrice(){
    let unidades: number = Number.parseInt(this.product.units.toString().trim());
    let precioProducto: number = Number.parseFloat(this.product.price.replace(",",".").toString().trim());
    let tax: number = Number.parseFloat(this.product.tax.toString().trim());
    let precioFinal: number = precioProducto/(1 + tax/100);
    let importeFinal: number = precioFinal*unidades;
    console.log(this.product.name.trim(), unidades, precioProducto.toFixed(2), tax, this.roundTwoDecimals(precioFinal).toFixed(2), this.roundTwoDecimals(importeFinal).toFixed(2));

    this.product.price = this.roundTwoDecimals(precioProducto).toFixed(2).replace(",",".");
    this.product.priceFinal = this.roundTwoDecimals(precioFinal).toFixed(2);
    this.product.amountFinal = this.roundTwoDecimals(importeFinal).toFixed(2);

    // Guardamos el producto temporal
    this.productTemp = this.product;

    //this.showFieldsFinal = true;
    this.disableInputs();
    this.disabledButtonCalculate = true;
    this.showButtonsFotterByActionAndPressButton(this.action, true);
    //this.showButtonsEditClearFields = true; 
  }

  disableInputs(){
    this.addProductForm.get('nameproduct').disable();
    this.addProductForm.get('units').disable();
    this.addProductForm.get('price').disable();
    this.addProductForm.get('tax').disable();
  }
  
  enableInputs(){
    this.addProductForm.get('nameproduct').enable();
    this.addProductForm.get('units').enable();
    this.addProductForm.get('price').enable();
    this.addProductForm.get('tax').enable();
  }

  editFields(){
    this.enableInputs();
    this.product = this.productTemp;
    this.product.priceFinal = '';
    this.product.amountFinal = '';
    this.showFieldsFinal = false; 
    this.disabledButtonCalculate = false;
    this.showButtonsEditClearFields = false; 
  }

  eraseFields(){
    // TODO
  }

  roundTwoDecimals(num: any): number{
    return Math.round(num * 100) / 100;
  }

  buttonToDisabledOrEnabled(){
    if(this.addProductForm.get('nameproduct').valid && 
        this.addProductForm.get('units').valid && 
        this.addProductForm.get('price').valid  &&
        this.addProductForm.get('tax').valid ){
          return false;
    }
    return true;
  }
  
  /*
  onlyNumberWeb(evt:any){
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    console.log(charCode, evt);
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //if (charCode >= 48 || charCode <= 57) {
        return false;
    }
    return true;
  }

  onlyNumberAndroid(evt:any){
    let arrayAndroid = ['BacketRight', 'Slash', 'Comma', 'Period'];
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    console.log(charCode, evt);
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    if (arrayAndroid.indexOf(evt.code) != -1){
      return false;
    }
    return true;
  } 
 
  onlyNumber(event:any) {
    //48 - 57
    let pass = /[4][8-9]{1}/.test(event.charCode) || /[5][0-7]{1}/.test(event.charCode);
    if (!pass) {
      return false;
    }
  }
  */

  showPromptDelete(product : Product) {
    const prompt = this.alertCtrl.create({
      title: '¿Borrar Producto?',
      message: "Producto <span class='text-prin' >' " + product.name + " '</span>",      
      buttons: [        
        {
          text: 'Borrar',
          handler: data => {
            //console.log('Saved clicked');
            this.productListService.removeProductToUserUid(product, this.auth.getUserUid()).then(() => {
              //this.navCtrl.setRoot(ListProductPage);
              this.presentToast('Producto borrado', 3000, 'bottom');
              this.navCtrl.popTo(ListProductPage);
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
  };   

  //Method to override the default back button action
  setBackButtonAction():void{
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      //this.navCtrl.setRoot(ListProductPage);
      this.navCtrl.popTo(ListProductPage);
    }
  }

  showButtonsFotterByActionAndPressButton(action: String, pressButtonCalculate: boolean){
      switch (action) {
        case 'view':
          this.disableInputs();  //this.onlyRead = true;
            this.showButtonCalculate = false;
          this.showFieldsFinal = true;
            this.showButtonsEditClearFields = false; 
            this.showButtonsDeleteAndUpdate = false;
            this.showButtonAdd=false;
          this.showButtonAccept = true;
          break;
        case 'edit':
          if(pressButtonCalculate){
            this.disableInputs(); 
          }
          else{
            this.enableInputs(); 
          }             
            this.showButtonCalculate = true;
          this.showFieldsFinal = pressButtonCalculate;
          this.showButtonsEditClearFields = pressButtonCalculate;  
          this.showButtonsDeleteAndUpdate = pressButtonCalculate;
          this.showButtonAdd=false;
          this.showButtonAccept = false;
          break;
        case 'add': 
          if(pressButtonCalculate){
            this.disableInputs(); 
          }
          else{
            this.enableInputs(); 
          }        
            this.showButtonCalculate = true;
          this.showFieldsFinal = pressButtonCalculate;
          this.showButtonsEditClearFields = pressButtonCalculate; 
          this.showButtonsDeleteAndUpdate = false;
          this.showButtonAdd=pressButtonCalculate;
          this.showButtonAccept = false;
          break;
      
        default:
          break;
      }
   
  }

  /*************** */
  ionViewDidLoad() : void{
    this.action = this.navParams.get('action');
    console.log( this.action);
    if(undefined != this.action && '' != this.action ){
      this.showButtonsFotterByActionAndPressButton(this.action, false);
      /*
      switch (this.action) {
        case 'view':
          this.disableInputs();  //this.onlyRead = true;
          this.showButtonCalculate = false;
          //this.showFieldsFinal = true;      
          this.showButtonsEditClearFields = false; 
          this.showButtonsDeleteAndUpdate = false;
          this.showButtonAccept = true;
          this.showButtonAdd=false;
          break;
        case 'edit':
          this.enableInputs(); //this.onlyRead = true;
          this.showButtonCalculate = true; 
          //this.showFieldsFinal = false;  
          this.showButtonsEditClearFields = false;  
          this.showButtonsDeleteAndUpdate = true;
          this.showButtonAccept = false;
          this.showButtonAdd=false;
          break;
        case 'add':
          this.enableInputs(); //this.onlyRead = true;
          this.showButtonCalculate = true;
          //this.showFieldsFinal = false;   
          this.showButtonsEditClearFields = false;   
          this.showButtonsDeleteAndUpdate = false;
          this.showButtonAccept = false;
          this.showButtonAdd=true;
          break;
      
        default:
          break;
      }
      */

      if(this.action == 'edit' || this.action == 'view'){
        this.product = this.navParams.get('product');
      }
    }
    
    this.setBackButtonAction();
  }
  ionViewWillEnter() : void{
    //console.log('ionViewWillEnter LoginPage');
  }

}
