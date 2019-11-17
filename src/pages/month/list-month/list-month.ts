import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController, Navbar, AlertController, Platform, ActionSheetController, ToastController } from 'ionic-angular';

import { MonthListService } from '../../../services/month-list.service';
import { AuthService } from '../../../services/auth.service';

/* Pages */
import { ListExpensePage } from '../../expense/list-expense/list-expense';

import { Month } from '../../../model/month/month.model';
import { Year } from '../../../model/year/year.model';
import { ListYearPage } from '../../year/list-year/list-year';

@Component({
  selector: 'page-list-month',
  templateUrl: 'list-month.html'
})

export class ListMonthPage {
  @ViewChild(Navbar) navBar: Navbar;

  public listExpensePage: any;
  public monthList: Month[];  
  public totalAmountFinalList: number = 0;

  public showLoading: boolean;
  public monthListServiceSubscribe;
  public year: Year; 
  
  public constructor( public navCtrl: NavController, 
                      public navParams: NavParams, 
                      public menuCtrl: MenuController, 
                      public alertCtrl: AlertController,
                      public platform : Platform,
                      private monthListService: MonthListService, 
                      public auth: AuthService,
                      public actionSheetCtrl: ActionSheetController,
                      public toastCtrl: ToastController) {  
                        
    // Push Page
    this.listExpensePage = ListExpensePage;   
  }


  processData(input: any): Month[]{           
    let resultAux = input.map(ch => ({key: ch.key, ...ch.payload.val()}));
    return resultAux.sort(this.compareNumbers);
  }

  compareNumbers(a:Month, b:Month) {
    return a.number - b.number;
  }

  totalAmountFinalListMonth(input: any){
    var amountFinal: number = 0;
    for(var i=0; i<input.length; i++){
      amountFinal = amountFinal + Number.parseFloat(input[i].amountFinal);
    }
    this.totalAmountFinalList = amountFinal;
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
  }

  //Method to override the default back button action
  setBackButtonAction():void{
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.monthListServiceSubscribe.unsubscribe();
      this.navCtrl.popTo(ListYearPage);
    }
  }

  /************** */
  ionViewDidLoad(): void{
    console.log('ionViewDidLoad ListMonthPage');    
  }

  ionViewWillEnter() : void {
    console.log("ionViewWillEnter ListMonthPage");
    this.year = this.navParams.get('year');
    this.showLoading=true;
    this.monthListServiceSubscribe = this.monthListService.getMonthListToUserUidAndExpenseList(this.auth.getUserUid(), this.year).snapshotChanges().subscribe(
      (result) => {
        this.showLoading=false;
        this.monthList = this.processData(result);
        //this.totalAmountFinalListYear(this.yearList);        
      },
      (err) => {
        console.log('problema', err);
        this.showLoading=false;
      },
      () => {
        console.log("completed");
        this.showLoading=false;
      }
    ); 
    this.setBackButtonAction();
  }

  ionViewDidEnter() : void{
    console.log('ionViewDidEnter ListMonthPage');   
    this.menuCtrl.enable(true, 'filtersmonth');    
  }

}
