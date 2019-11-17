import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Expense } from '../model/expense/expense.model';

@Injectable()
export class ExpenseListService {

  private expenseListRef: AngularFireList<any>;

  constructor( private db: AngularFireDatabase ) { 
  }

  /**********/
  getExpenseListToUserUid(userId: string, yearKey: string, monthKey: string) {
    this.expenseListRef = this.db.list<Expense>(`expense-list/${userId}/${yearKey}/months/${monthKey}/expenses`);
    return this.expenseListRef;
  }

  addExpenseToUserUid(userId: string, yearKey: string, monthKey: string, expense: Expense){
    this.expenseListRef = this.db.list<Expense>(`expense-list/${userId}/${yearKey}/months/${monthKey}/expenses`);
    return this.expenseListRef.push(expense);
  }

  updateExpenseToUserUid(userId: string, yearKey: string, monthKey: string, expense: Expense){
    this.expenseListRef = this.db.list<Expense>(`expense-list/${userId}/${yearKey}/months/${monthKey}/expenses`);
    return this.expenseListRef.update(expense.key, expense);
  }

  removeExpenseToUserUid(userId: string, yearKey: string, monthKey: string, expense: Expense) {
    this.expenseListRef = this.db.list<Expense>(`expense-list/${userId}/${yearKey}/months/${monthKey}/expenses`);
    return this.expenseListRef.remove(expense.key);
  }

  removeListExpense(userId: string, yearKey: string, monthKey: string) {
    this.expenseListRef = this.db.list<Expense>(`expense-list/${userId}/${yearKey}/months/${monthKey}/expenses`);
    return this.expenseListRef.remove();
  }

}