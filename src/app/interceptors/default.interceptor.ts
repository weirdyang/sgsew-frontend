import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('intercepting')
    req = req.clone({
      withCredentials: true,
      setHeaders: { "x-csrf-token": this.authService.csrfToken }
    });

    return next.handle(req);
  }
}
