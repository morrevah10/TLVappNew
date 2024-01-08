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
import { ProfileComponent } from './pages/profile/profile.component';
import { LoadindComponent } from './cmps/loadind/loadind.component';
import { UserMessagesComponent } from './pages/user-messages/user-messages.component';
import { AdminGuard } from '../app/helpers/admin.guard'; 
import { DashbordComponent } from './pages/dashbord/dashbord.component';
import { PostDetailsComponent } from './pages/post-details/post-details.component';
import { ImagePageComponent } from './cmps/image-page/image-page.component';


const routes: Routes = [
  { path: '', component: LoadindComponent },
  { path: 'welcom', component: OpeningComponent },
  { path: 'home', component: HomeComponent ,canActivate: [AuthGuard],},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'rantal', component: RantalComponent ,canActivate: [AuthGuard],},
  { path: 'apartment', component: ApartmentListComponent ,canActivate: [AuthGuard],},
  { path: 'apartment/edit/:id', component: EditDescriptionComponent,canActivate: [AuthGuard], },
  { path: 'apartment/:id', component: ApartmentDetailsComponent ,canActivate: [AuthGuard],},
  { path: 'personalInfo', component: PersonalInfoComponent,canActivate: [AuthGuard], },
  { path: 'personalInfo/changPassword', component: ChangPasswordComponent ,canActivate: [AuthGuard],},
  { path: 'about', component: AboutComponent ,canActivate: [AuthGuard],},
  { path: 'myposts', component: myPostsComponent,canActivate: [AuthGuard], },
  { path: 'terms', component: TermsComponent ,canActivate: [AuthGuard],},
  { path: 'forgetPassword', component: ForgotPasswordComponent },
  {path: 'profile' , component: ProfileComponent,canActivate: [AuthGuard],},
  {
    path: 'resetPassword',
    component: RestPasswordComponent,
  },
  { path: 'accessDenied', component: AccessDeniedComponent,canActivate: [AuthGuard], },

{path:'messages',component:UserMessagesComponent,canActivate: [AdminGuard]},
{path:'dashboard',component:DashbordComponent,canActivate: [AdminGuard]},
{ path: 'post-details/:status/:postId', component: PostDetailsComponent,canActivate: [AuthGuard], },
{ path: 'image-page/:apartmentId', component: ImagePageComponent ,canActivate: [AuthGuard],},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
