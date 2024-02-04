import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../srvices/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.log('AdminGuard is executing');
    // Get the user's email from the authentication service
    const userEmail = this.authService.getUserEmail();

    // Check if the logged-in user is an admin
    if (this.authService.isAdminUser(userEmail!)) {
        console.log('User is an admin, allowing access to dashboard');
        return true;
      } else {
        console.log('User is not an admin, redirecting to home');
        this.router.navigate(['/home']);
        return false;
      }
  }
}