import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Navbar } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Product } from '../../../model/product/product.model';
import { ProductListService } from '../../../services/product-list.service';
import { AuthService } from '../../../services/auth.service';

import { ListProductPage } from '../list-product/list-product';

import { VALIDATION_MESSAGES } from '../../../validators/form';

@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html'
})
export class AddProductPage {
  @ViewChild(Navbar) navBar: Navbar;

  public disabledCalculate: boolean = false;
  public showFieldsFinal: boolean = false;

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
                      private fb: FormBuilder) {   
    
    this.validationMessages = VALIDATION_MESSAGES;   

    this.addProductForm = this.fb.group({
      nameproduct:['', Validators.compose([Validators.required])],
      units:['', Validators.compose([Validators.required,  Validators.pattern("^[1-9][0-9]*$"), Validators.min(0) ])],
      price:['', Validators.compose([Validators.required,  Validators.pattern("(^(0|([1-9][0-9]*))(\.[0-9]{1,2})?$)|(^(0{0,1}|([1-9][0-9]*))(\.[0-9]{1,2})?$)"), Validators.min(0) ])],
      //price:['', Validators.compose([Validators.required,  Validators.pattern("^(?!^0\.00$)(([1-9][0-9]*)|([0]))\.[0-9]{1,2}$"), Validators.min(0) ])],
      tax:['', Validators.compose([Validators.required,  Validators.pattern("(^(0|([1-9][0-9]*))?$)"), Validators.min(0), Validators.max(100) ])]
    });

  }

  addProduct(product: Product){
    this.productListService.addProductToUserUid(product, this.auth.getUserUid()).then(ref => {
      this.navCtrl.setRoot(ListProductPage);
    });
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

    this.saveTempData(this.product.name.trim(), 
                      unidades,  
                      this.roundTwoDecimals(this.product.price).toFixed(2), 
                      tax.toString(),
                      this.roundTwoDecimals(this.product.priceFinal).toFixed(2), 
                      this.roundTwoDecimals(this.product.amountFinal).toFixed(2));

    this.showFieldsFinal = true;
    this.disableInputs();
    this.disabledCalculate = true;
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
    this.disabledCalculate = false;
  }

  eraseFields(){

  }

  roundTwoDecimals(num: any): number{
    return Math.round(num * 100) / 100;
  }

  saveTempData(name: string, units: number, price: string, tax: string, priceFinal: string, amountFinal: string){
    this.productTemp.name = name;
    this.productTemp.units = units;
    this.productTemp.price = price;
    this.productTemp.tax = tax;
    this.productTemp.priceFinal = priceFinal;
    this.productTemp.amountFinal = amountFinal;
  }

  checkButtonDisabled(){
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

   

  //Method to override the default back button action
  setBackButtonAction(){
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.navCtrl.setRoot(ListProductPage);
    }
  }

  /*************** */
  ionViewDidLoad(): void{
    console.log('ionViewDidLoad AddProductPage');
    this.setBackButtonAction();
  }
  ionViewWillEnter(): void{
    console.log('ionViewWillEnter LoginPage');
  }

}
