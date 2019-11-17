import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase} from '@angular/fire/database';

import { Year } from '../model/year/year.model';


@Injectable()
export class YearListService {

  private yearListRef: AngularFireList<any>;  

  constructor( private db: AngularFireDatabase ) { 
  }

  /**********/
  getYearListToUserUidAndExpenseList(userId: string) {
    this.yearListRef = this.db.list<Year>(`expense-list/${userId}`, ref => ref.orderByChild('number'));
    return this.yearListRef;
  }

  addYearToUserUidAndExpenseList(year: Year, userId: string){
    this.yearListRef = this.db.list<Year>(`expense-list/${userId}`);
    return this.yearListRef.push(year);
  }

  updateYearToUserUidAndExpenseList(year: Year, userId: string){
    this.yearListRef = this.db.list<Year>(`expense-list/${userId}`);
    return this.yearListRef.update(year.key, year);
  }

  removeYearToUserUidAndExpenseList(year: Year, userId: string) {
    this.yearListRef = this.db.list<Year>(`expense-list/${userId}`);
    return this.yearListRef.remove(year.key);
  }

  removeListYearByExpenseList(userId: string) {
    this.yearListRef = this.db.list<Year>(`expense-list`);
    return this.yearListRef.remove(userId);
  }  

}