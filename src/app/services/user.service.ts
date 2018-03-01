import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {Repository} from '../models/repository';
import {Feed} from '../models/feed';
import {BaseService} from './base.service';
import {Observable} from 'rxjs';

@Injectable()
export class UserService {

  public basePath = '/api/user';
  private timer = Observable.timer(0, 1500);

  constructor(private baseService: BaseService) {
  }

  public getUser(): Promise<User> {
    return this.baseService.get<User>(this.basePath);
  }

  public getRepositories(): Promise<Repository[]> {
    return this.baseService.get<Repository[]>(this.basePath + '/repos?all=true&flush=true');
  }

  public getLatestFeeds(): Observable<Feed[]> {
    return this.timer.flatMap(_ => this.baseService.get<Feed[]>(this.basePath + '/feed?latest=true'));
  }

}
