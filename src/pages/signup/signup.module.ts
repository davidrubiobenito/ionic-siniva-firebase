import { NgModule, ErrorHandler } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/module';

import { SignupPage } from './signup';

@NgModule({
    declarations: [SignupPage],
    imports: [IonicPageModule.forChild(SignupPage)]
})
export class SignupModule {
}