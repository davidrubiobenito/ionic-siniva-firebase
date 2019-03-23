import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Note } from '../model/note/note.model';

@Injectable()
export class NoteListService {

  private noteListRef: AngularFireList<any>;

  constructor( private db: AngularFireDatabase ) { 
  }

  /**********/
  getNoteListToUserUid(userId: string) {
    this.noteListRef = this.db.list<Note>(`note-list/${userId}`);
    return this.noteListRef;
  }

  addNoteToUserUid(note: Note, userId: string){
    this.noteListRef = this.db.list<Note>(`note-list/${userId}`);
    return this.noteListRef.push(note);
  }

  updateNoteToUserUid(note: Note, userId: string){
    this.noteListRef = this.db.list<Note>(`note-list/${userId}`);
    return this.noteListRef.update(note.key, note);
  }

  removeNoteToUserUid(note: Note, userId: string) {
    this.noteListRef = this.db.list<Note>(`note-list/${userId}`);
    return this.noteListRef.remove(note.key);
  }

  removeListNote(userId: string) {
    this.noteListRef = this.db.list<Note>(`note-list`);
    return this.noteListRef.remove(userId);
  }

}