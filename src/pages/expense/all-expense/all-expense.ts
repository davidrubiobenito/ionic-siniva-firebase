import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Navbar, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Expense } from '../../../model/expense/expense.model';
import { YearMonth } from '../../../model/expense/yearmonth.model';

import { ExpenseListService } from '../../../services/expense-list.service';
import { AuthService } from '../../../services/auth.service';

import { ListExpensePage } from '../list-expense/list-expense';

import { VALIDATION_MESSAGES } from '../../../validators/form';
import { ExpenseFieldsValidator } from '../../../validators/expensefields';

@Component({
  selector: 'page-all-expense',
  templateUrl: 'all-expense.html'
})
export class AllExpensePage {
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

  public expense: Expense = {
    name: '',
    units: undefined,
    price:'',
    amountFinal: ''
  };

  public expenseTemp: Expense = {
    name: '',
    units: undefined,
    price:'',
    amountFinal: ''
  };

  public yearMonthModel: YearMonth = {
    yearkey: '',
    monthkey: ''
  };

  public expenseForm: FormGroup;
  public addExpenseError: string;
  public validationMessages: any;
  
  public constructor( public navCtrl: NavController, 
                      public navParams: NavParams, 
                      private expenseListService: ExpenseListService, 
                      private auth: AuthService,
                      private fb: FormBuilder,
                      public alertCtrl: AlertController,
                      public toastCtrl: ToastController) {   
    
    this.validationMessages = VALIDATION_MESSAGES;   

    this.expenseForm = this.fb.group({
      nameexpense:['', Validators.compose([Validators.required])],
      units:['', Validators.compose([Validators.required,  ExpenseFieldsValidator.isValidUnits, Validators.min(0) ])],
      price:['', Validators.compose([Validators.required,  ExpenseFieldsValidator.isValidPrice, Validators.min(0) ])]
    });

  }

  addExpense(yearMonthModel: YearMonth, expense: Expense){
    this.expenseListService.addExpenseToUserUid(this.auth.getUserUid(),yearMonthModel.yearkey, yearMonthModel.monthkey, expense).then(ref => {
      this.navCtrl.popTo(ListExpensePage);
    });
  }

  updateExpense(yearMonthModel: YearMonth, expense: Expense){    
    this.expenseListService.updateExpenseToUserUid(this.auth.getUserUid(),yearMonthModel.yearkey, yearMonthModel.monthkey, expense).then(() =>{
      this.navCtrl.popTo(ListExpensePage);
    });
  }

  removeExpense(yearMonthModel: YearMonth, expense: Expense) {
    this.showPromptDelete(yearMonthModel, expense);   
  }

  back(){
    this.navCtrl.popTo(ListExpensePage);
  }

  calculatePrice(){
    let unidades: number = Number.parseInt(this.expense.units.toString().trim());
    let precioGasto: number = Number.parseFloat(this.expense.price.replace(",",".").toString().trim());
    let importeFinal: number = precioGasto*unidades;
    console.log(this.expense.name.trim(), unidades, precioGasto.toFixed(2), this.roundTwoDecimals(importeFinal).toFixed(2));

    this.expense.price = this.roundTwoDecimals(precioGasto).toFixed(2).replace(",",".");
    this.expense.amountFinal = this.roundTwoDecimals(importeFinal).toFixed(2);

    // Guardamos el producto temporal
    this.expenseTemp = this.expense;

    //this.showFieldsFinal = true;
    this.disableInputs();
    this.disabledButtonCalculate = true;
    this.showButtonsFotterByActionAndPressButton(this.action, true);
  }

  disableInputs(){
    this.expenseForm.get('nameexpense').disable();
    this.expenseForm.get('units').disable();
    this.expenseForm.get('price').disable();
  }
  
  enableInputs(){
    this.expenseForm.get('nameexpense').enable();
    this.expenseForm.get('units').enable();
    this.expenseForm.get('price').enable();
  }

  editFields(){
    this.enableInputs();
    this.expense = this.expenseTemp;
    this.expense.amountFinal = '';
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
    if(this.expenseForm.get('nameexpense').valid && 
        this.expenseForm.get('units').valid && 
        this.expenseForm.get('price').valid){
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

  showPromptDelete(yearMonthModel: YearMonth, expense : Expense) {
    const prompt = this.alertCtrl.create({
      title: '¿Borrar Gasto?',
      message: "Gasto <span class='text-prin' >' " + expense.name + " '</span>",      
      buttons: [        
        {
          text: 'Borrar',
          handler: data => {
            this.expenseListService.removeExpenseToUserUid(this.auth.getUserUid(), yearMonthModel.yearkey, yearMonthModel.monthkey, expense).then(() => {
              this.presentToast('Gasto borrado', 3000, 'bottom');
              this.navCtrl.popTo(ListExpensePage);
            });  
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
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
    });
    toast.present();
  };   

  //Method to override the default back button action
  setBackButtonAction():void{
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.navCtrl.popTo(ListExpensePage);
    }
  }

  showButtonsFotterByActionAndPressButton(action: String, pressButtonCalculate: boolean){
      switch (action) {
        case 'view':
          this.disableInputs();
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
    console.log('ionViewDidLoad AllExpensePage'); 
  }

  ionViewWillEnter() : void{
    this.action = this.navParams.get('action');
    this.yearMonthModel.yearkey = this.navParams.get('yearMonthModel').yearkey;
    this.yearMonthModel.monthkey = this.navParams.get('yearMonthModel').monthkey;
    console.log('ionViewWillEnter AllExpensePage, ', this.action, this.yearMonthModel);
    if(undefined != this.action && '' != this.action ){
      this.showButtonsFotterByActionAndPressButton(this.action, false);
     
      if(this.action == 'edit' || this.action == 'view'){
        this.expense = this.navParams.get('expense');
      }
    }    
    this.setBackButtonAction();
  }

}
