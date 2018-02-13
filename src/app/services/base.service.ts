import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';

@Injectable()
export class BaseService {

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  public get<T>(path: string, param: string | number = '', queryParams: Object = {}): Promise<T> {

    const builtUrl = this.buildUrl(path, param, queryParams);

    return this.http.get<T>(builtUrl, this.generateOptions())
      .toPromise()
      .catch(this.handleGlobalError);

  }

  public post<T>(path: string, body: Object = null): Promise<T> {
    const requestOptions = this.generateOptions();
    const builtUrl = this.buildUrl(path, '', {});

    return this.http.post<T>(builtUrl, body, requestOptions).toPromise()
      .catch(this.handleGlobalError);
  }

  public patch<T>(path: string, body: Object = null): Promise<T> {
    const requestOptions = this.generateOptions();
    const builtUrl = this.buildUrl(path, '', {});

    return this.http.patch<T>(builtUrl, body, requestOptions).toPromise()
      .catch(this.handleGlobalError);
  }

  public delete<T>(path: string, param: string | number = '', queryParams: Object = {}): Promise<T> {
    const requestOptions = this.generateOptions();
    const builtUrl = this.buildUrl(path, param, queryParams);

    return this.http.delete<T>(builtUrl, requestOptions).toPromise()
      .catch(this.handleGlobalError);
  }

  private generateOptions() {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = Object.assign(headers, headers.set('Authorization', this.authService.getBearerToken()));
    const options = {
      headers: headers,
    };

    return options;
  }

  private buildUrl(path: string, param: string | number, queryParams: Object): string {
    param = param ? '/' + param : '';
    return `${environment.baseUrl}${path}${param}${this.buildQueryParams(queryParams)}`;
  }

  private buildQueryParams(queryParams: Object) {
    if (Object.keys(queryParams).length === 0) {
      return '';
    } else {
      return '?' + Object.keys(queryParams).map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`;
      }).join('&');
    }
  }

  private handleGlobalError(error: HttpErrorResponse): Promise<HttpErrorResponse | any> {
    console.log(`Http Error occurred: `, error);
    throw error;
  }

}
