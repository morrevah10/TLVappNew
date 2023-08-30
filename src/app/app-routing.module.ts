import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './helpers/authGuard';

import { LandPageComponent } from './pages/land-page/land-page.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { RantalComponent } from './pages/rantal/rantal.component';
import { ApartmentListComponent } from './cmps/apartment/apartment-list/apartment-list.component';
import { ApartmentDetailsComponent } from './cmps/apartment/apartment-details/apartment-details.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AboutComponent } from './pages/about/about.component';
import { MyReviewsComponent } from './pages/my-reviews/my-reviews.component';
import { myPostsComponent } from './pages/my-posts/my-posts.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ChangPasswordComponent } from './pages/chang-password/chang-password.component';

const routes: Routes = [
  { path: '', component: LandPageComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'rantal', component: RantalComponent },
  { path: 'apartment', component: ApartmentListComponent },
  { path: 'apartment/:id', component: ApartmentDetailsComponent },
  { path: 'personalInfo', component: PersonalInfoComponent },
  { path: 'personalInfo/changPassword', component: ChangPasswordComponent },
  { path: 'about', component: AboutComponent },
  { path: 'reviews', component: MyReviewsComponent },
  { path: 'myposts', component: myPostsComponent },
  { path: 'terms', component: TermsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
