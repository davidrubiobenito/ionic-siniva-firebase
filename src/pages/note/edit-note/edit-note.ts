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
      this.navCtrl.setRoot(ListNotePage);
    });
  }

  removeNote(note: Note) {
    this.noteListService.removeNoteToUserUid(note, this.auth.getUserUid()).then(() => {
      this.navCtrl.setRoot(ListNotePage);
    });
  }

  //Method to override the default back button action
  setBackButtonAction(){
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.navCtrl.setRoot(ListNotePage);
    }
  }

  /*************** */
  ionViewDidLoad(){
    this.note = this.navParams.get('note');
    this.setBackButtonAction();
  }
  ionViewWillEnter(){
    //console.log('ionViewWillEnter LoginPage');
  }

}
