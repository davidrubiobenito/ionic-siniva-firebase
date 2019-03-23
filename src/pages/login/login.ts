import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { VALIDATION_MESSAGES } from '../../app/form';

/* Pages */
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  //private goHomePage: any;

  public loginForm: FormGroup;
  public loginError: string;
  public validationMessages: any;

  public isVisibleFormEntrar: boolean = true;
  
  public constructor( public navCtrl: NavController, 
                      private auth: AuthService, 
                      private fb: FormBuilder) {
                        
    this.auth.signOut();
    this.validationMessages = VALIDATION_MESSAGES;  

    this.loginForm = this.fb.group({
      email:['', Validators.compose([Validators.required,  Validators.pattern('^[A-Z0-9a-z\\._%+-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$')])],
      password:['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(11)])]
    });
  }

  logIn(){

    let data = this.loginForm.value;

    if(!data.email || !data.password){
      return;
    }

    let credentials = { 
      email: data.email, 
      password: data.password 
    };
  
    this.auth.signInWithEmail(credentials).then( 
      () => this.navCtrl.push(HomePage),
      error => this.loginError = error.message
    );

  }

 
  signUp(){

    let data = this.loginForm.value;

    if(!data.email){
      return;
    }

    let credentials = { 
      email: data.email, 
      password: data.password 
    };
  
    this.auth.signUp(credentials).then( 
      () => this.navCtrl.setRoot(HomePage),
      error => this.loginError = error.message
    );

  }

  pulsadoBotonHeader(boton: number){
    switch (boton) {
      case 1:
        this.isVisibleFormEntrar = true;
        break;
    
      case 2:
        this.isVisibleFormEntrar = false;
        break;    
    }
  }

  /*
  loginWithGoogle() {
    this.auth.signInWithGoogle().then(
        () => this.navCtrl.setRoot(HomePage),
        error => console.log(error.message)
      );
  }
  */

  /*
  private ionViewDidLoad(){
    console.log('ionViewDidLoad LoginPage');
  }

  private ionViewWillEnter(){
    console.log('ionViewWillEnter LoginPage');
  }
  */

}
