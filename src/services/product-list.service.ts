import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Product } from '../model/product/product.model';
import { User } from '../model/user/user.model';


@Injectable()
export class ProductListService {

  private productListRef: AngularFireList<any>;
  private userListRef: any;

  constructor( private db: AngularFireDatabase ) { 
    //this.userListRef = this.db.list<User>(`product-list/${this.userId}`);
    this.productListRef = this.db.list<Product>('note-list');   
  }

  /** node List */
  getProductList() {
    return this.productListRef;
  }

  addProduct(product: Product) {
    return this.productListRef.push(product);
  }

  updateProduct(product: Product){
    return this.productListRef.update(product.key, product);
  }

  removeProduct(product: Product) {
    return this.productListRef.remove(product.key);
  }

  /**********/
  getProductListToUserUid(userId: string) {
    this.userListRef = this.db.list<User>(`product-list/${userId}`);
    return this.userListRef;
  }

  addProductToUserUid(product: Product, userId: string){
    this.userListRef = this.db.list<User>(`product-list/${userId}`);
    return this.userListRef.push(product);
  }

  updateProductToUserUid(product: Product, userId: string){
    this.userListRef = this.db.list<User>(`product-list/${userId}`);
    return this.userListRef.update(product.key, product);
  }

  removeProductToUserUid(product: Product, userId: string) {
    this.userListRef = this.db.list<User>(`product-list/${userId}`);
    return this.userListRef.remove(product.key);
  }

  removeListProduct(userId: string) {
    this.userListRef = this.db.list<User>(`product-list`);
    return this.userListRef.remove(userId);
  }

}