import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {Token} from '../models/auth.model';

@Injectable()
export class AuthService {

  private token = 'TOKEN';
  private basePath = '/pipeline/api/v1/token';

  constructor(private baseService: BaseService) {
  }

  public remove() {
    return sessionStorage.removeItem(this.token);
  }

  public clear() {
    return sessionStorage.clear();
  }

  public setToken(value: any) {
    return sessionStorage.setItem(this.token, value);
  }

  public getBearerToken() {
    const value = sessionStorage.getItem(this.token);
    return 'Bearer ' + value;
  }

  public getToken() {
    return sessionStorage.getItem(this.token);
  }

  public getPipelineToken(): Promise<Token> {
    return this.baseService.get<Token>(this.basePath);
  }

}
