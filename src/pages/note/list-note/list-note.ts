import { Component } from '@angular/core';
import { NavController, MenuController, AlertController, Platform  } from 'ionic-angular';
//import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet'
//import { Toast } from '@ionic-native/toast';

import { Observable } from 'rxjs';
//import { map, filter, switchMap } from 'rxjs/operators';

import { ActionSheetController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { AuthService } from '../../../services/auth.service';
import { NoteListService } from '../../../services/note-list.service';

/* Pages */
import { LoginPage } from '../../login/login';
import { HomePage } from '../../home/home';
import { AddNotePage } from '../../note/add-note/add-note';
import { EditNotePage } from '../../note/edit-note/edit-note';

import { Note } from '../../../model/note/note.model';

@Component({
  selector: 'page-list-note',
  templateUrl: 'list-note.html'
})
export class ListNotePage {

  public pages: Array<{icon: string, title: string, component: any}>;
  public addNotePage: any;
  public editNotePage: any;
  public noteList: Observable<Note[]>;  

  public constructor( public navCtrl: NavController, 
                      public menuCtrl: MenuController, 
                      //private actionSheet: ActionSheet,
                      //private toast: Toast,
                      public alertCtrl: AlertController,
                      public platform : Platform,
                      public noteListService: NoteListService, 
                      public auth: AuthService,
                      public actionSheetCtrl: ActionSheetController,
                      public toastCtrl: ToastController) {
    
   
    // used for an example of ngFor and navigation
    this.pages = [    
      { icon: 'add', title: 'Añadir Nota', component: AddNotePage }
    ];

    // Push Page
    this.addNotePage = AddNotePage;
    this.editNotePage = EditNotePage;
  }

  showMenu() {
    this.menuCtrl.open('filtersnote');
  }

  hideMenu() {
    this.menuCtrl.close('filtersnote');
  }

  login() {
    this.menuCtrl.close();
	  this.auth.signOut();
	  this.navCtrl.setRoot(LoginPage);
  }

  logout() {
	  this.menuCtrl.close();
	  this.auth.signOut();
	  this.navCtrl.setRoot(LoginPage);
  }

  processData(input: any): Observable<Note[]>{     
    let resultAux = input.map(ch => ({key: ch.key, ...ch.payload.val()}));
    return resultAux;
  }

  removeNote(note: Note) {
    this.showPrompt(note);       
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: 'Nota borrada correctamente',
      buttons: [{text: 'Aceptar', cssClass:"button-secundary"}],
      cssClass: 'dialogCustomCss'
    });
    alert.present();
  }

  /*
  presentActionSheet() {
    let buttonLabels = ['Salir Aplicación', 'Creditos'];
    const options: ActionSheetOptions = {
      title: 'Opciones ...',
      subtitle: 'Elige una opción',
      buttonLabels: buttonLabels,
      addCancelButtonWithLabel: 'Cancelar',
      addDestructiveButtonWithLabel: 'Borrar Lista Notas',
      androidTheme: 3,
      destructiveButtonLast: false,
      androidEnableCancelButton: true
    };

    this.actionSheet.show(options).then((buttonIndex: number) => {
      console.log('Button pressed: ' + buttonIndex);
      switch(buttonIndex){
        case 1:
          this.showPromptBorrarList();
        break;
        case 2:
          this.platform.exitApp();
        break;
        case 3:
          this.presentToast('David Rubio Benito', 'short', 'bottom');
        break;
      }
    });

  }
  */

  presentActionSheet() {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones ...',
      buttons: [
        {
          text: 'Borrar Lista Notas',
          icon: 'trash',
          handler: () => {
            this.showPromptBorrarList();
          }
        },
        {
          text: 'Salir Aplicación',
          icon: 'log-out',
          handler: () => {
            this.platform.exitApp();
          }
        },   
        {
          text: 'Creditos',
          icon: 'information',
          handler: () => {
            this.presentToast('David Rubio Benito', 3000, 'bottom');
          }
        }
      ],
      enableBackdropDismiss: true
    });

    actionSheet.present();
  }

  showPrompt(note : Note) {
    const prompt = this.alertCtrl.create({
      title: '¿Borrar Nota?',
      message: "Nota <span class='text-prin' >' " + note.title + " '</span>",      
      buttons: [        
        {
          text: 'Borrar',
          handler: data => {
            //console.log('Saved clicked');
            this.noteListService.removeNoteToUserUid(note, this.auth.getUserUid()).then(() => {
              this.presentToast('Nota borrada', 3000, 'bottom');
              //this.navCtrl.setRoot(HomePage);
            });  
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
            //console.log('Cancel clicked');
          },
          role: 'cancel',
          cssClass: 'button-primary'
        } 
      ],
      enableBackdropDismiss: true
    });
    prompt.present();
  }

  showPromptBorrarList() {
    const prompt = this.alertCtrl.create({
      title: 'Borrar Lista Notas',
      message: "¿Desea BORRAR TODAS las Notas?",      
      buttons: [
        {
          text: 'Borrar',
          handler: data => {
            //console.log('Aceptar clicked');
            this.noteListService.removeListNote(this.auth.getUserUid()).then(() => {
              this.presentToast('Lista Borrada', 3000, 'bottom');
              //this.navCtrl.setRoot(HomePage);
            });
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
            //console.log('Cancelar clicked');
          },
          role: 'cancel',
          cssClass: 'button-primary'
        },
      ],
      enableBackdropDismiss: true
    });
    prompt.present();
  }

  /*
  presentToast(message: string, duration: string, position: string) {
    this.toast.show(message, duration, position).subscribe(
      toast => {
        console.log(toast);
    });
  }
  */

  presentToast(message: string, duration: number, position: string) {
    let toast = this.toastCtrl.create({ 
      message: message,
      duration: duration,
      position: position,
      dismissOnPageChange: true,
      cssClass: 'toast'
    });

    toast.onDidDismiss(() => {
      //console.log('Dismissed toast');
    });

    toast.present();
  }

  exitApp(){
    this.platform.exitApp();
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

  /************** */
  ionViewDidLoad(){
    //console.log('ionViewDidLoad LoginPage');        
    this.noteListService.getNoteListToUserUid(this.auth.getUserUid()).snapshotChanges().subscribe(
      (result) => {
        this.noteList = this.processData(result);
      },
      (err) => {
        console.log('error get notes', err);
      },
      () => {
        console.log("completed");
      }
    );  
    
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'filtersnote');
  }

}
