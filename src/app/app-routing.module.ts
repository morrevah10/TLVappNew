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
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // {path:'search-result',component:ApartmentListComponent},
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
  {path: 'profile' , component: ProfileComponent},
  {
    path: 'resetPassword',
    component: RestPasswordComponent,
  },
  { path: 'accessDenied', component: AccessDeniedComponent,canActivate: [AuthGuard], },

{path:'messages',component:UserMessagesComponent},
{path:'dashboard',component:DashbordComponent,canActivate: [AdminGuard]},
{ path: 'post-details/:status/:postId', component: PostDetailsComponent },
{ path: 'image-page/:apartmentId', component: ImagePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
