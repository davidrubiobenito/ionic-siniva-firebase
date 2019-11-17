import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController, Navbar, AlertController, Platform, ActionSheetController, ToastController } from 'ionic-angular';

import { Observable } from 'rxjs';

import { ExpenseListService } from '../../../services/expense-list.service';
import { AuthService } from '../../../services/auth.service';

/* Pages */
import { ListMonthPage } from '../../month/list-month/list-month';
import { AllExpensePage } from '../../expense/all-expense/all-expense';

import { Expense } from '../../../model/expense/expense.model';
import { YearMonth } from '../../../model/expense/yearmonth.model';
import { Month } from '../../../model/month/month.model';

@Component({
  selector: 'page-list-expense',
  templateUrl: 'list-expense.html'
})

export class ListExpensePage {
  @ViewChild(Navbar) navBar: Navbar;

  public pages: Array<{icon: string, title: string, component: any}>;
  public allExpensePage: any;
  public expenseList: Observable<Expense[]>;  
  public totalAmountFinalList: number = 0;

  public showLoading: boolean;
  public expenseListServiceSubscribe;
  public yearMonthModel: YearMonth = {
    yearkey: '',
    monthkey: ''
  };

  public monthObjectServiceSubscribe;
  public monthObject: Month= {
    key: '',
    name: '',
    number: 0,
    amountFinal:'',
    expenses: []
  };  

  public constructor( public navCtrl: NavController, 
                      public navParams: NavParams, 
                      public menuCtrl: MenuController, 
                      public alertCtrl: AlertController,
                      public platform : Platform,
                      private expenseListService: ExpenseListService, 
                      public auth: AuthService,
                      public actionSheetCtrl: ActionSheetController,
                      public toastCtrl: ToastController) {
       
    // used for an example of ngFor and navigation
    this.pages = [
      { icon: 'add', title: 'Añadir Gasto', component: AllExpensePage }
    ];

    // Push Page
    this.allExpensePage = AllExpensePage;
  }

  processDataObservable(input: any): Observable<Expense[]>{     
    let resultAux = input.map(ch => ({key: ch.key, ...ch.payload.val()}));
    return resultAux;
  }

  processDataArray(input: any): Expense[]{     
    let resultAux = input.map(ch => ({...ch}));
    return resultAux;
  }

  processDataObject(input: any, amountFinal: number): Month{
    let mountAux: Month = {
      key: '',
      name:'',
      amountFinal: '',
      number: 0,
      expenses: []  
    }
    mountAux = {key: input.key, ...input.payload.val()};
    mountAux.amountFinal = amountFinal.toString();
    return mountAux;
  }

  totalAmountFinalListExpense(input: any){
    var amountFinal: number = 0;
    for(var i=0; i<input.length; i++){
      amountFinal = amountFinal + Number.parseFloat(input[i].amountFinal);
    }
    this.totalAmountFinalList = amountFinal;
  }

  removeExpense(expense: Expense) {
    this.showPrompt(expense);       
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones ...',
      buttons: [
        {
          text: 'Borrar Lista Gastos',
          icon: 'trash',
          handler: () => {
            this.showPromptBorrarList();
          },
          role: 'destructive'
        }
      ],
      enableBackdropDismiss: true
    });
    actionSheet.present();
  }


  showPrompt(expense : Expense) {
    const prompt = this.alertCtrl.create({
      title: '¿Borrar Gasto?',
      message: "Gasto <span class='text-prin' >' " + expense.name + " '</span>",      
      buttons: [        
        {
          text: 'Borrar',
          handler: data => {
            this.expenseListService.removeExpenseToUserUid(this.auth.getUserUid(), this.yearMonthModel.yearkey, this.yearMonthModel.monthkey, expense).then(() => {
              this.presentToast('Gasto borrado', 3000, 'bottom');
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

  showPromptBorrarList() {
    const prompt = this.alertCtrl.create({
      title: 'Borrar Lista',
      message: "¿Desea BORRAR TODOS los Gastos de la Lista?",      
      buttons: [
        {
          text: 'Borrar',
          handler: data => {
            this.expenseListService.removeListExpense(this.auth.getUserUid(), this.yearMonthModel.yearkey, this.yearMonthModel.monthkey).then(() => {
              this.presentToast('Lista Borrada', 3000, 'bottom');
            });
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
          },
          cssClass: 'button-primary'
        }
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
  }

  //Method to override the default back button action
  setBackButtonAction():void{
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.expenseListServiceSubscribe.unsubscribe();
      this.navCtrl.popTo(ListMonthPage);
    }
  }

  /************** */
  ionViewDidLoad(): void{
    console.log('ionViewDidLoad ListExpensePage');    
  }

  ionViewWillEnter() : void {
    console.log("ionViewWillEnter ListExpensePage");
    this.yearMonthModel.yearkey = this.navParams.get('year').key;
    this.yearMonthModel.monthkey = this.navParams.get('month').key;
    this.monthObject = this.navParams.get('month');
    this.showLoading=true; 
    this.expenseListServiceSubscribe = this.expenseListService.getExpenseListToUserUid(this.auth.getUserUid(), this.yearMonthModel.yearkey,  this.yearMonthModel.monthkey).snapshotChanges().subscribe(
      (result) => {
        this.showLoading=false;
        this.expenseList = this.processDataObservable(result);
        this.totalAmountFinalListExpense(this.expenseList);        
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
    console.log('ionViewDidEnter ListExpensePage');   
    this.menuCtrl.enable(true, 'filtersexpense');    
  }

}
