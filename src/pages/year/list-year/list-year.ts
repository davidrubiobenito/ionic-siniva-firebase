import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController, Navbar, AlertController, Platform, ActionSheetController, ToastController } from 'ionic-angular';

import { YearListService } from '../../../services/year-list.service';
import { MonthListService } from '../../../services/month-list.service';
import { AuthService } from '../../../services/auth.service';

import { MONTHS } from '../../../helpers/month.helper';
import { Year } from '../../../model/year/year.model';

/* Pages */
import { HomePage } from '../../home/home';
import { ListMonthPage } from '../../month/list-month/list-month';

@Component({
  selector: 'page-list-year',
  templateUrl: 'list-year.html'
})

export class ListYearPage {
  @ViewChild(Navbar) navBar: Navbar;

  public yearList: Year[];  
  public totalAmountFinalList: number = 0;

  public showLoading: boolean;
  public yearListServiceSubscribe;
  public monthsConst: any; 

  public listMonthPage: any;

  public constructor( public navCtrl: NavController, 
                      public menuCtrl: MenuController, 
                      public alertCtrl: AlertController,
                      public platform : Platform,
                      private yearListService: YearListService, 
                      private monthListService: MonthListService, 
                      public auth: AuthService,
                      public actionSheetCtrl: ActionSheetController,
                      public toastCtrl: ToastController) {

    // Push Page
    this.listMonthPage = ListMonthPage;    
  }

  processData(input: any): Year[]{     
    let resultAux = input.map(ch => ({key: ch.key, ...ch.payload.val()}));
    return resultAux.sort(this.compareNumbers);
  }

  compareNumbers(a:Year, b:Year) {
    return b.number - a.number;
  }

  totalAmountFinalListYear(input: any){
    var amountFinal: number = 0;
    for(var i=0; i<input.length; i++){
      amountFinal = amountFinal + Number.parseFloat(input[i].amountFinal);
    }
    this.totalAmountFinalList = amountFinal;
  }

  removeYear(year: Year) {
    console.log(year);
    this.showPrompt(year);       
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones ...',
      buttons: [
        {
          text: 'Borrar Lista Años',
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

  showPrompt(year : Year) {
    const prompt = this.alertCtrl.create({
      title: '¿Borrar Año?',
      message: "Año <span class='text-prin' >' " + year.number + " '</span>",      
      buttons: [        
        {
          text: 'Borrar',
          handler: data => {
            this.yearListService.removeYearToUserUidAndExpenseList(year, this.auth.getUserUid()).then(() => {
              this.presentToast('Año borrado', 3000, 'bottom');
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
      message: "¿Desea BORRAR TODOS los Años de la Lista?",      
      buttons: [
        {
          text: 'Borrar',
          handler: data => {
            this.yearListService.removeListYearByExpenseList(this.auth.getUserUid()).then(() => {
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

  showPromptAddYear() {
    const prompt = this.alertCtrl.create({
      title: 'Introduzca Año',
      inputs: [
        {
          name: 'year',
          placeholder: 'Año'
        }
      ], 
      buttons: [
        {
          text: 'Añadir',
          handler: data => {
           this.checkValidationData(null, data, 'add');
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
          },
          cssClass: 'button-primary'
        }
      ],
      cssClass: 'alertTextCenter'
    });
    prompt.present();
  }

  showPromptEditYear(year: Year) {
    const prompt = this.alertCtrl.create({
      title: 'Introduzca Año',
      inputs: [
        {
          name: 'year',
          placeholder: 'Año',
          value: year.number.toString()
        }
      ], 
      buttons: [
        {
          text: 'Editar',
          handler: data => {
           this.checkValidationData(year, data, 'edit');
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
          },
          cssClass: 'button-primary'
        }
      ],
      cssClass: 'alertTextCenter'
    });
    prompt.present();
  }

  checkValidationData(year: Year, data: any, action: string){   
    if(null == data.year || undefined == data.year || "" == data.year.trim() || 4 != data.year.trim().length || this.onlyNumber('number', data.year) == false  ){
      this.alertCtrl.create({ 
          title: 'Validación',
          message: 'El valor introducido debe ser un número entero y de 4 dígitos.', 
          buttons: [
            { 
              text: 'Aceptar',
              cssClass: 'button-primary'
            }
          ],
          cssClass: 'alertTextCenter'
        }
      ).present();              
      return false;
    }else if(this.ckeckIfYearExists(data)){
      this.alertCtrl.create({ 
        title: 'Validación',
        message: 'El año que ha introducido ya existe.', 
        buttons: [
          { 
            text: 'Aceptar',
            cssClass: 'button-primary'
          }
        ],
        cssClass: 'alertTextCenter'
      }
      ).present();              
      return false;
    }else{  
      let yearAux: Year = {
        number: 0,
        amountFinal: '',
        months: []
      };      
      if(action == 'add'){
        yearAux.number = data.year;
        this.yearListService.addYearToUserUidAndExpenseList(yearAux, this.auth.getUserUid()).then(
          (snap) =>{   
            console.log(snap.key);        
            this.monthListService.addMonthsToUserUidAndExpenseList(this.auth.getUserUid(), snap.key);          
            this.presentToast('Año Añadido: ' + yearAux.number, 3000, 'bottom');
          }              
        )
      }
      else{
        year.number = data.year;
        this.yearListService.updateYearToUserUidAndExpenseList(year, this.auth.getUserUid()).then(
          () => {
            this.presentToast('Año Editado: ' + year.number, 3000, 'bottom');
          }
        )
      }      
    }  
  }

  ckeckIfYearExists(data: any): boolean{
    let resultFunc= false;    
    if(this.yearList.filter(years => years.number == data.year).length>0){
      resultFunc= true;
    }     
    return resultFunc;
  }

  onlyNumber(numericType: string, input: string) : boolean{
    let result:boolean =false;
    let regex = {
      number: new RegExp(/^\d+$/),
      decimal: new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g)
    };

    if(String(input).match(regex[numericType])){
      result = true;
    }
    return result;    
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
      this.yearListServiceSubscribe.unsubscribe();
      this.navCtrl.setRoot(HomePage);
    }
  }

  /************** */
  ionViewDidLoad(): void{
    console.log('ionViewDidLoad ListYearPage');    
  }

  ionViewWillEnter() : void {
    console.log("ionViewWillEnter ListYearPage");
    this.monthsConst = MONTHS; 
    this.showLoading=true;
    this.yearListServiceSubscribe = this.yearListService.getYearListToUserUidAndExpenseList(this.auth.getUserUid()).snapshotChanges().subscribe(
      (result) => {
        this.showLoading=false;
        this.yearList = this.processData(result);
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
    console.log('ionViewDidEnter ListYearPage');   
    this.menuCtrl.enable(true, 'filtersyear');    
  }

}
