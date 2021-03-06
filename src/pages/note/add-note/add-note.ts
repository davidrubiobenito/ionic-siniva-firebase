import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Navbar } from 'ionic-angular';

import { AuthService } from '../../../services/auth.service';
import { NoteListService } from '../../../services/note-list.service';
import { Note } from '../../../model/note/note.model';

import { ListNotePage } from '../list-note/list-note';

@Component({
  selector: 'page-add-note',
  templateUrl: 'add-note.html'
})
export class AddNotePage {

  @ViewChild(Navbar) navBar: Navbar;
  public note: Note = {
    title: '',
    content: ''
  };
  
  public constructor( public navCtrl: NavController, 
                      public navParams: NavParams, 
                      private noteListService: NoteListService, 
                      private auth: AuthService) {    
  }

  addNote(note: Note){
    this.noteListService.addNoteToUserUid(note, this.auth.getUserUid()).then(ref => {
      this.navCtrl.popTo(ListNotePage);
    });
  }

  //Method to override the default back button action
  setBackButtonAction(){
    this.navBar.backButtonClick = () => {
      //Write here wherever you wanna do
      this.navCtrl.popTo(ListNotePage);
    }
  }

  /*************** */
  ionViewDidLoad(): void{
    console.log('ionViewDidLoad AddNotePage');    
  }
  ionViewWillEnter(): void{
    console.log('ionViewWillEnter AddNotePage');
    this.setBackButtonAction();
  }

  ionViewDidEnter() : void{
    console.log('ionViewDidEnter AddNotePage');   
  }

}
