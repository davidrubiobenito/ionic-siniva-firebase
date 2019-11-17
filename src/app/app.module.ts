import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';

/* Modules */
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { FIREBASE_CONFIG } from './firebase.credentials';


/* Sevices */
import { ProductListService } from '../services/product-list.service';
import { NoteListService } from '../services/note-list.service';
import { ExpenseListService } from '../services/expense-list.service';
import { YearListService } from '../services/year-list.service';
import { MonthListService } from '../services/month-list.service';
import { AuthService } from '../services/auth.service';


/* Pages */
import { ListNotePage } from '../pages/note/list-note/list-note';
import { AddNotePage } from '../pages/note/add-note/add-note';
import { EditNotePage } from '../pages/note/edit-note/edit-note';
import { ListProductPage } from '../pages/product/list-product/list-product';
import { AddProductPage } from '../pages/product/add-product/add-product';
import { EditProductPage } from '../pages/product/edit-product/edit-product';
import { AllProductPage } from '../pages/product/all-product/all-product';
import { ListYearPage } from '../pages/year/list-year/list-year';
import { ListMonthPage } from '../pages/month/list-month/list-month';
import { ListExpensePage } from '../pages/expense/list-expense/list-expense';
import { AllExpensePage } from '../pages/expense/all-expense/all-expense';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ActionSheetController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@NgModule({
  declarations: [
    MyApp,
    ListNotePage,
    AddNotePage,
    EditNotePage,
    ListProductPage,
    AddProductPage,
    EditProductPage,
    AllProductPage,
    ListYearPage,
    ListMonthPage,
    ListExpensePage,
    AllExpensePage,
    HomePage,
    LoginPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListNotePage,
    AddNotePage,
    EditNotePage,
    ListProductPage,
    AddProductPage,
    EditProductPage,
    AllProductPage,
    ListYearPage,
    ListMonthPage,
    ListExpensePage,
    AllExpensePage,
    HomePage,
    LoginPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProductListService, NoteListService, ExpenseListService, YearListService, MonthListService, AngularFireAuth, AuthService,
    ActionSheetController,
    ToastController
  ]
})
export class AppModule {}
