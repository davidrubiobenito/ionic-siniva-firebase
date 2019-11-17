import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

import { Year } from '../model/year/year.model';
import { Month } from '../model/month/month.model';

import { MONTHS } from '../helpers/month.helper';


@Injectable()
export class MonthListService {

  private monthListRef: AngularFireList<any>;
  private monthObjectRef: AngularFireObject<any>;
  public monthsConst: any;  

  constructor( private db: AngularFireDatabase ) { 
    this.monthsConst = MONTHS;   
  }

  /**********/
  getMonthListToUserUidAndExpenseList(userId: string, year: Year) {
    this.monthListRef = this.db.list<Month>(`expense-list/${userId}/${year.key}/months`, ref => ref.orderByChild('number'));
    return this.monthListRef;
  }

  addMonthsToUserUidAndExpenseList(userId: string, keyYear: any){
    this.monthListRef = this.db.list<Month>(`expense-list/${userId}/${keyYear}/months`);
    this.monthsConst.forEach(element => {
      let monthAux: Month ={
        name: element.name,
        amountFinal: element.amountFinal,
        number: element.number,
        expenses: element.expenses
      };
      this.monthListRef.push(monthAux);
    });   
  }

  getMonthObjectToUserUidAndExpenseList(userId: string, keyYear: string, keyMonth: string){
    this.monthObjectRef = this.db.object<Month>(`expense-list/${userId}/${keyYear}/months/${keyMonth}`);
    return this.monthObjectRef;
  }

  updateAmountMonthToUserUidAndExpenseList(userId: string, keyYear: string, keyMonth: string, month: Month){
    this.monthListRef = this.db.list<Month>(`expense-list/${userId}/${keyYear}/months`);
    return this.monthListRef.update(month.key, month);
  }
  

}