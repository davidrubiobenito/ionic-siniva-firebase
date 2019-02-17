import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { Product } from '../../model/product/product.model';
import { ProductListService } from '../../services/product-list.service';
import { AuthService } from '../../services/auth.service';

import { HomePage } from '../home/home';


@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html'
})
export class AddProductPage {
  @ViewChild(Navbar) navBar: Navbar;

  public product: Product = {
    title: '',
    content: ''
  };
  
  public constructor( public navCtrl: NavController, 
                      public navParams: NavParams, 
                      private productListService: ProductListService, 
                      private auth: AuthService) {    
  }

  addProduct(product: Product){
    /*
    this.productListService.addProduct(product).then(ref => {
      this.navCtrl.setRoot(HomePage);
    });
    */
    this.productListService.addProductToUserUid(product, this.auth.getUserUid()).then(ref => {
      this.navCtrl.setRoot(HomePage);
    });
  }

  //Method to override the default back button action
  setBackButtonAction(){
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.navCtrl.setRoot(HomePage);
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
