import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { VALIDATION_MESSAGES } from '../../validators/form';
import { EmailValidator } from '../../validators/email';

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
  public signUpForm: FormGroup;
  public loginError: string;
  public validationMessages: any;

  public isVisibleFormEntrar: boolean = true;
  
  public constructor( public navCtrl: NavController, 
                      private auth: AuthService, 
                      private fb: FormBuilder,
                      public alertCtrl: AlertController) {
                        
    this.auth.signOut();
    this.validationMessages = VALIDATION_MESSAGES;  

    this.loginForm = this.fb.group({
      //email:['', Validators.compose([Validators.required,  Validators.pattern('^[A-Z0-9a-z\\._%+-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$')])],
      email:['', Validators.compose([Validators.required,  EmailValidator.isValid])],
      password:['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(11)])]
    });

    this.signUpForm = this.fb.group({
      //email:['', Validators.compose([Validators.required,  Validators.pattern('^[A-Z0-9a-z\\._%+-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$')])],
      email:['', Validators.compose([Validators.required,  EmailValidator.isValid])],
      password:['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(11)])],
      confirmpassword:['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(11)])]
    });

  }

  logIn(){
    let data = this.loginForm.value;

    if(!data.email.trim() || !data.password.trim()){
      const message_info: string= "Por favor, rellene los campos <span class='text-prin'> Email, Contraseña </span> correctamente.";
      this.showPromptInfo(message_info);
      return;
    }

    let credentials = { 
      email: data.email, 
      password: data.password 
    };
      
    this.auth.signInWithEmail(credentials).then( 
      () => {this.navCtrl.setRoot(HomePage); },
      (error) => { this.loginError = error.message}
    );
  }

 
  signUp(){
    let data = this.signUpForm.value;
    console.log(data);

    if(!data.email.trim() || !data.password.trim() || !data.confirmpassword.trim()){
      const message_info_fields: string= "Por favor, rellene los campos <span class='text-prin'> Email, Contraseña y Confirmación Contraseña </span> correctamente.";
      this.showPromptInfo(message_info_fields);
      return;
    }

    if(data.password.trim() != data.confirmpassword.trim()){
      const message_passwords_fields: string= "Por favor, rellene los campos <span class='text-prin'> Contraseña y Confirmación Contraseña </span> correctamente.";
      this.showPromptInfo(message_passwords_fields);
      return;
    }

    let credentials = { 
      email: data.email, 
      password: data.password 
    };
  
    this.auth.signUp(credentials).then( 
      () => {this.navCtrl.setRoot(HomePage); },
      (error) => { this.loginError = error.message}
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

  showPromptInfo(messageInfo: string) {
    const prompt = this.alertCtrl.create({
      title: 'Información',
      message: messageInfo,      
      buttons: [
        {
          text: 'Aceptar',
          handler: data => {
            //console.log('Aceptar clicked');
          },
          cssClass: 'button-primary'
        },
      ]
    });
    prompt.present();
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
