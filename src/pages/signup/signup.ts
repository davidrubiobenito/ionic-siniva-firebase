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
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  
  public goHomePage: any;

  public signupForm: FormGroup;
  public signupError: string;
  public validationMessages: any;

  public constructor( public navCtrl: NavController, 
                      private auth: AuthService, 
                      private fb: FormBuilder ) {
                        
    // Push page
    //this.goHomePage = HomePage;  
    this.validationMessages = VALIDATION_MESSAGES;  

    this.signupForm = this.fb.group({
      email:['', Validators.compose([Validators.required,  Validators.pattern("^[A-Z0-9a-z\\._%+-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$")])],
      password:['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(11)])]
    });
  }

  signup(){

    let data = this.signupForm.value;

    if(!data.email){
      return;
    }

    let credentials = { 
      email: data.email, 
      password: data.password 
    };
  
    this.auth.signUp(credentials).then( 
      () => this.navCtrl.setRoot(HomePage),
      error => this.signupError = error.message
    );

  }

  /*
  private ionViewDidLoad(){
    console.log('ionViewDidLoad SignupPage');
  }

  private ionViewWillEnter(){
    console.log('ionViewWillEnter SignupPage');
  }
  */

}
