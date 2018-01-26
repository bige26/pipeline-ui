import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Repository } from '../models/repository';
import { Feed } from '../models/feed';
import { BaseService } from './base.service';

@Injectable()
export class UserService {

  public basePath: string = "/api/user";

  constructor(
    private baseService: BaseService
  ) { }

  public getUser(): Promise<User> {
    return this.baseService.get<User>(this.basePath);
  }

  public getRepositories(): Promise<Repository[]> {
    return this.baseService.get<Repository[]>(this.basePath + "/repos?all=true");
  }

  public getLatestFeeds(): Promise<Feed[]> {
    return this.baseService.get<Feed[]>(this.basePath + "/feed?latest=true");
  }

}
