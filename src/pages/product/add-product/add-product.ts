import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Navbar } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Product } from '../../../model/product/product.model';
import { ProductListService } from '../../../services/product-list.service';
import { AuthService } from '../../../services/auth.service';

import { ListProductPage } from '../list-product/list-product';

import { VALIDATION_MESSAGES } from '../../../app/form';

@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html'
})
export class AddProductPage {
  @ViewChild(Navbar) navBar: Navbar;

  public product: Product = {
    name: '',
    units: 1,
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
      units:['', Validators.compose([Validators.required,  Validators.pattern("[0-9]*"), Validators.min(1) ])],
      tax:['', Validators.compose([Validators.required,  Validators.pattern("[0-9]*"), Validators.max(100) ])]
    });

  }

  addProduct(product: Product){
    this.productListService.addProductToUserUid(product, this.auth.getUserUid()).then(ref => {
      this.navCtrl.setRoot(ListProductPage);
    });
  }

  calculatePrice(){

  }

  editFields(){

  }

  eraseFields(){

  }
  
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
  

  /*
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
  ionViewDidLoad(){
    // console.log('ionViewDidLoad AddProductPage');
    this.setBackButtonAction();
  }
  ionViewWillEnter(){
    //console.log('ionViewWillEnter LoginPage');
  }

}
