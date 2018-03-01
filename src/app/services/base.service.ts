import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

@Injectable()
export class BaseService {

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  public get<T>(path: string, param: string | number = '', queryParams: Object = {}): Promise<T> {

    const builtUrl = this.buildUrl(path, param, queryParams);

    return this.http.get<T>(builtUrl)
      .toPromise()
      .catch(this.handleGlobalError);

  }

  public post<T>(path: string, body: Object = null): Promise<T> {
    const builtUrl = this.buildUrl(path, '', {});

    return this.http.post<T>(builtUrl, body).toPromise()
      .catch(this.handleGlobalError);
  }

  public put<T>(path: string, body: Object = null): Promise<T> {
    const builtUrl = this.buildUrl(path, '', {});

    return this.http.put<T>(builtUrl, body).toPromise()
      .catch(this.handleGlobalError);
  }

  public head<T>(path: string, param: string | number = ''): Promise<T> {
    const builtUrl = this.buildUrl(path, param, {});

    return this.http.head<T>(builtUrl).toPromise()
      .catch(this.handleGlobalError);
  }

  public patch<T>(path: string, body: Object = null): Promise<T> {
    const builtUrl = this.buildUrl(path, '', {});

    return this.http.patch<T>(builtUrl, body).toPromise()
      .catch(this.handleGlobalError);
  }

  public delete<T>(path: string, param: string | number = '', queryParams: Object = {}): Promise<T> {
    const builtUrl = this.buildUrl(path, param, queryParams);

    return this.http.delete<T>(builtUrl).toPromise()
      .catch(this.handleGlobalError);
  }

  private buildUrl(path: string, param: string | number, queryParams: Object): string {
    param = param ? '/' + param : '';
    let baseUrl = '';
    if (path.match('/clusters')) {
      baseUrl = environment.clusterBaseUrl;
    } else {
      baseUrl = environment.droneBaseUrl;
    }
    return `${baseUrl}${path}${param}${this.buildQueryParams(queryParams)}`;
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
