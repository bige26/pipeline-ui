import {Injectable} from '@angular/core';

@Injectable()
export class AuthService {

  private token = 'droneToken';

  constructor() {
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

}
