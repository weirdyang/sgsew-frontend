import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {

  constructor(private authService: AuthService, private userService: UserService) {

  }
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log(this.authService.isAuthenticated, 'isauth');
    console.log(this.authService.getUser(), 'user');
    if (this.authService.isAuthenticated) {
      this.userService.getSelf()
        .subscribe(next => this.authService.setUser(next));
    }

    return this.authService.isAuthenticated
      && this.authService.getUser()?.role === 'admin';
  }
}
