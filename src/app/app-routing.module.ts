import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandPageComponent } from './pages/land-page/land-page.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { RantalComponent } from './pages/rantal/rantal.component';
import { ApartmentListComponent } from './cmps/apartment/apartment-list/apartment-list.component';
import { ApartmentDetailsComponent } from './cmps/apartment/apartment-details/apartment-details.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AboutComponent } from './pages/about/about.component';
import { myPostsComponent } from './pages/my-posts/my-posts.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ChangPasswordComponent } from './pages/chang-password/chang-password.component';
import { EditDescriptionComponent } from './cmps/edit-description/edit-description.component';
import { ForgotPasswordComponent } from './cmps/password/forgot-password/forgot-password.component';
import { RestPasswordComponent } from './cmps/password/rest-password/rest-password.component';
import { AccessDeniedComponent } from './cmps/access-denied/access-denied.component';
import { AuthGuard } from './helpers/authGuard';
import { OpeningComponent } from './cmps/opening/opening.component';

const routes: Routes = [
  // { path: '', component: LandPageComponent },
  { path: '', component: OpeningComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'rantal', component: RantalComponent },
  { path: 'apartment', component: ApartmentListComponent },
  { path: 'apartment/edit/:id', component: EditDescriptionComponent },
  { path: 'apartment/:id', component: ApartmentDetailsComponent },
  { path: 'personalInfo', component: PersonalInfoComponent },
  { path: 'personalInfo/changPassword', component: ChangPasswordComponent },
  { path: 'about', component: AboutComponent },
  { path: 'myposts', component: myPostsComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'forgetPassword', component: ForgotPasswordComponent },
  {
    path: 'resetPassword',
    component: RestPasswordComponent,
  },
  { path: 'accessDenied', component: AccessDeniedComponent,canActivate: [AuthGuard], },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
