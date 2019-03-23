import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Product } from '../model/product/product.model';

@Injectable()
export class ProductListService {

  private productListRef: AngularFireList<any>;

  constructor( private db: AngularFireDatabase ) { 
  }

  /**********/
  getProductListToUserUid(userId: string) {
    this.productListRef = this.db.list<Product>(`product-list/${userId}`);
    return this.productListRef;
  }

  addProductToUserUid(product: Product, userId: string){
    this.productListRef = this.db.list<Product>(`product-list/${userId}`);
    return this.productListRef.push(product);
  }

  updateProductToUserUid(product: Product, userId: string){
    this.productListRef = this.db.list<Product>(`product-list/${userId}`);
    return this.productListRef.update(product.key, product);
  }

  removeProductToUserUid(product: Product, userId: string) {
    this.productListRef = this.db.list<Product>(`product-list/${userId}`);
    return this.productListRef.remove(product.key);
  }

  removeListProduct(userId: string) {
    this.productListRef = this.db.list<Product>(`product-list`);
    return this.productListRef.remove(userId);
  }

}