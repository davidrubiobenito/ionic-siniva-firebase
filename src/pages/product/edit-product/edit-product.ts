import { Component, ViewChild  } from '@angular/core';
import { NavController, NavParams, Navbar } from 'ionic-angular';

import { Product } from '../../../model/product/product.model';
import { ProductListService } from '../../../services/product-list.service';
import { AuthService } from '../../../services/auth.service';

import { ListProductPage } from '../list-product/list-product';

@Component({
  selector: 'page-edit-product',
  templateUrl: 'edit-product.html'
})
export class EditProductPage {  
  @ViewChild(Navbar) navBar: Navbar;

  public product: Product = {
    title: '',
    content: ''
  }

  public constructor(public navCtrl: NavController, 
                     public navParams: NavParams, 
                     private productListService: ProductListService, 
                     private auth: AuthService) {
  }

  updateProduct(product: Product){    
    this.productListService.updateProductToUserUid(product, this.auth.getUserUid()).then(() =>{
      this.navCtrl.setRoot(ListProductPage);
    });
  }

  removeProduct(product: Product) {
    this.productListService.removeProductToUserUid(product, this.auth.getUserUid()).then(() => {
      this.navCtrl.setRoot(ListProductPage);
    });
  }

  //Method to override the default back button action
  setBackButtonAction(){
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.navCtrl.setRoot(ListProductPage);
    }
  }

  /*************** */
  ionViewDidLoad(){
    this.product = this.navParams.get('product');
    this.setBackButtonAction();
  }
  ionViewWillEnter(){
    //console.log('ionViewWillEnter LoginPage');
  }

}
