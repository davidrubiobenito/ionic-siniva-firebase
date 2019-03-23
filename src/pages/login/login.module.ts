import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/module';

import { LoginPage } from './login';

@NgModule({
    declarations: [LoginPage],
    imports: [IonicPageModule.forChild(LoginPage)]
})
export class LoginModule {
}