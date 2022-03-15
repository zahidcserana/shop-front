import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class HttpInspectorService implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const online = sessionStorage.getItem('online_store');

    if (this.checkOnline() && online) {
      const data = JSON.parse(online);
      const token = data.store.token ? data.store.token : '';
      const location = data.location.id ? data.location.id : '';
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token).set('Location', location)
      });
      return next.handle(authReq) as any;
    } else if (this.auth.authenticated) {
      const token = this.auth.getToken() ? this.auth.getToken() : '';
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(authReq) as any;
    } else {
      return next.handle(req) as any;
    }

  }

  checkOnline() {
    const arr = ['admin', 'partner'];
    for (const l of arr) {
      if (this.router.url.includes(l)) {
        return false;
      }
    }
    return true;
  }


}
