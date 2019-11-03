import { Component, ViewChild} from '@angular/core';
import { NavController, MenuController, Navbar, AlertController, Platform, ActionSheetController, ToastController  } from 'ionic-angular';

import { Observable } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
import { NoteListService } from '../../../services/note-list.service';

/* Pages */
import { HomePage } from '../../home/home';
import { AddNotePage } from '../../note/add-note/add-note';
import { EditNotePage } from '../../note/edit-note/edit-note';

import { Note } from '../../../model/note/note.model';

@Component({
  selector: 'page-list-note',
  templateUrl: 'list-note.html'
})
export class ListNotePage {  
  @ViewChild(Navbar) navBar: Navbar;

  public pages: Array<{icon: string, title: string, component: any}>;
  public addNotePage: any;
  public editNotePage: any;
  public noteList: Observable<Note[]>;  

  public showLoading: boolean;

  public noteListServiceSubscribe;

  public constructor( public navCtrl: NavController, 
                      public menuCtrl: MenuController, 
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

  processData(input: any): Observable<Note[]>{     
    let resultAux = input.map(ch => ({key: ch.key, ...ch.payload.val()}));
    return resultAux;
  }

  removeNote(note: Note) {
    this.showPrompt(note);       
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones ...',
      buttons: [
        {
          text: 'Borrar Lista Notas',
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

  showPrompt(note : Note) {
    const prompt = this.alertCtrl.create({
      title: '¿Borrar Nota?',
      message: "Nota <span class='text-prin' >' " + note.title + " '</span>",      
      buttons: [        
        {
          text: 'Borrar',
          handler: data => {
            this.noteListService.removeNoteToUserUid(note, this.auth.getUserUid()).then(() => {
              this.presentToast('Nota borrada', 3000, 'bottom');
            });  
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
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
            this.noteListService.removeListNote(this.auth.getUserUid()).then(() => {
              this.presentToast('Lista Borrada', 3000, 'bottom');
            });
          },
          cssClass: 'button-secundary'
        },
        {
          text: 'Cancelar',
          handler: data => {
          },
          role: 'cancel',
          cssClass: 'button-primary'
        },
      ],
      enableBackdropDismiss: true
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
      this.noteListServiceSubscribe.unsubscribe();
      this.navCtrl.setRoot(HomePage);
    }
  }

  /************** */
  ionViewDidLoad(): void{
    console.log('ionViewDidLoad NoteListPage');         
  }

  ionViewWillEnter() : void {
    console.log("ionViewWillEnter NoteListPage");
    this.showLoading=true;       
    this.noteListServiceSubscribe = this.noteListService.getNoteListToUserUid(this.auth.getUserUid()).snapshotChanges().subscribe(
      (result) => {
        this.showLoading=false;
        this.noteList = this.processData(result);
      },
      (err) => {
        console.log('error get notes', err);
        this.showLoading=false;
      },
      () => {
        console.log("completed");
        this.showLoading=false;
      }
    );  

    this.setBackButtonAction();
  }

  ionViewDidEnter(): void {
    console.log("ionViewDidEnter NoteListPage");
    this.menuCtrl.enable(true, 'filtersnote');
  }

}
