import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'; 



import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


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


    

    
  ],
  providers: [AuthService,UserService,PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
