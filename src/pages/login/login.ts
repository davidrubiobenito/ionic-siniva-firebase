import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
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
                      public alertCtrl: AlertController,
                      public toastCtrl: ToastController) {
                        
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

   // Ingreso con email
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
      () => {
        //this.navCtrl.setRoot(HomePage); 
        this.emailVerified();
      },
      (error) => { this.loginError = error.message}
    );
  }

  emailVerified(){
    if(this.auth.emailVerified()){
      this.navCtrl.setRoot(HomePage); 
    }
    else{
      this.presentToast('Por favor verifique su email', 3000, 'bottom');
    }
  }

  // Registro con email
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
      () => {
        //this.navCtrl.setRoot(HomePage); 
       this.sendEmailVerification();        
      },
      (error) => { this.loginError = error.message}
    );
  }

  sendEmailVerification(){
    this.auth.sendEmailVerification().then(
      () => {
        this.presentToast('Usuario registrado. Por favor compruebe su email para su verificación', 3000, 'bottom');
        this.signUpForm.value.email = "";
        this.signUpForm.value.password = "";
        this.signUpForm.value.confirmpassword = "";
      },
      (error) => { this.loginError = error.message}
    )
  }

  forgotPassword(){
    let data = this.loginForm.value;

    if(!data.email.trim()){
      const message_info: string= "Por favor, rellene el campo <span class='text-prin'> Email </span> correctamente.";
      this.showPromptInfo(message_info);
      return;
    }

    let credentials = { 
      email: data.email
    };

    this.auth.sendPasswordResetEmail(credentials).then( 
      () => {
        this.presentToast('Contraseña enviada a su email', 3000, 'bottom');       
      },
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

  /*
  loginWithGoogle() {
    this.auth.signInWithGoogle().then(
        () => this.navCtrl.setRoot(HomePage),
        error => console.log(error.message)
      );
  }
  */

  /***************/
  ionViewDidLoad(): void{
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() :void{
    console.log('ionViewWillEnter LoginPage');
  }

  ionViewDidEnter(): void{
    console.log('ionViewDidEnter LoginPage');    
  }
  
}
