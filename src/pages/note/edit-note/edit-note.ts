import { Component, ViewChild  } from '@angular/core';
import { NavController, NavParams, Navbar } from 'ionic-angular';

import { AuthService } from '../../../services/auth.service';
import { NoteListService } from '../../../services/note-list.service';

import { Note } from '../../../model/note/note.model';

import { ListNotePage } from '../list-note/list-note';

@Component({
  selector: 'page-edit-note',
  templateUrl: 'edit-note.html'
})
export class EditNotePage {  

  @ViewChild(Navbar) navBar: Navbar;

  public isEdit: boolean = false;

  public note: Note = {
    title: '',
    content: ''
  }

  public constructor(public navCtrl: NavController, 
                     public navParams: NavParams, 
                     private noteListService: NoteListService, 
                     private auth: AuthService) {
  }

  updateNote(note: Note){    
    this.noteListService.updateNoteToUserUid(note, this.auth.getUserUid()).then(() =>{
      //this.navCtrl.setRoot(ListNotePage);
      this.navCtrl.popTo(ListNotePage);
    });
  }

  removeNote(note: Note) {
    this.noteListService.removeNoteToUserUid(note, this.auth.getUserUid()).then(() => {
      //this.navCtrl.setRoot(ListNotePage);
      this.navCtrl.popTo(ListNotePage);
    });
  }

  back(){
    //this.navCtrl.setRoot(ListNotePage);
    this.navCtrl.popTo(ListNotePage);
  }

  //Method to override the default back button action
  setBackButtonAction(){
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      //this.navCtrl.setRoot(ListNotePage);
      this.navCtrl.popTo(ListNotePage);
    }
  }

  /*************** */
  ionViewDidLoad(){
    this.note = this.navParams.get('note');
    this.isEdit = this.navParams.get('isEdit');
    this.setBackButtonAction();
  }
  ionViewWillEnter(){
    //console.log('ionViewWillEnter LoginPage');
  }

}
