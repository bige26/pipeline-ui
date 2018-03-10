import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../auth.service';

export class BaseInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone(this.getHeaders(req));
    return next.handle(request);
  }

  private getHeaders(req: HttpRequest<any>) {

    let headers: HttpHeaders = new HttpHeaders().append('Content-Type', 'application/json');

    if (!req.url.endsWith('/token')) {
      headers = headers.append('Authorization', this.authService.getBearerToken());
    }

    return {
      headers: headers
    };
  }

}
