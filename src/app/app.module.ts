import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';

import { ToastrModule } from 'ngx-toastr';

import { UserService } from './srvices/user.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app-root/app.component';
import { HaederComponent } from './cmps/haeder/haeder.component';
import { LandPageComponent } from './pages/land-page/land-page.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthService } from './srvices/auth.service';
import { RantalComponent } from './pages/rantal/rantal.component';
import { PostService } from './srvices/post.service';
import { FooterComponent } from './cmps/footer/footer.component';
import { ApartmentListComponent } from './cmps/apartment/apartment-list/apartment-list.component';
import { ApartmentDetailsComponent } from './cmps/apartment/apartment-details/apartment-details.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { myPostsComponent } from './pages/my-posts/my-posts.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ChangPasswordComponent } from './pages/chang-password/chang-password.component';
import { ImgUploadModalComponent } from './cmps/img-upload-modal/img-upload-modal.component';
import { DeletDialogComponent } from './cmps/delet-dialog/delet-dialog.component';
import { EditDescriptionComponent } from './cmps/edit-description/edit-description.component';
import { ForgotPasswordComponent } from './cmps/password/forgot-password/forgot-password.component';
import { RestPasswordComponent } from './cmps/password/rest-password/rest-password.component';
import { PopupComponent } from './cmps/popup/popup.component';

import {MatChipsModule} from '@angular/material/chips';
import { AccessDeniedComponent } from './cmps/access-denied/access-denied.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';



import { TranslateLoaderImpl } from './helpers/translate.loader';


import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LanguageSwitcherComponent } from './cmps/language-switcher/language-switcher.component';
import { LanguageDirective } from './helpers/language.directive';


import {MatStepperModule} from '@angular/material/stepper';
import { DatepickerComponent } from './cmps/datepicker/datepicker.component'

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    AppComponent,
    HaederComponent,
    LandPageComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    RantalComponent,
    FooterComponent,
    ApartmentListComponent,
    ApartmentDetailsComponent,
    PersonalInfoComponent,
    myPostsComponent,
    AboutComponent,
    TermsComponent,
    ChangPasswordComponent,
    ImgUploadModalComponent,
    DeletDialogComponent,
    EditDescriptionComponent,
    ForgotPasswordComponent,
    RestPasswordComponent,
    PopupComponent,
    AccessDeniedComponent,
    LanguageSwitcherComponent,
    LanguageDirective,
    DatepickerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,

    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatDividerModule,
    MatChipsModule,
    CarouselModule.forRoot(),

    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLoaderImpl
      }
    }),
    BsDatepickerModule.forRoot(),

    BrowserAnimationsModule,

    MatStepperModule

  ],
  providers: [AuthService, UserService, PostService,TranslateLoaderImpl],
  bootstrap: [AppComponent],
})
export class AppModule {}
