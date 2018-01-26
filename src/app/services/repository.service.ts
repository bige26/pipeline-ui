import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Repository } from '../models/repository';
import { Build } from '../models/build';

@Injectable()
export class RepositoryService {

  private basePath: string = "/api/repos/";

  constructor(
    private baseService: BaseService    
  ) { }

  public activate(owner: string, name: string): Promise<Repository> {
    return this.baseService.post<Repository>(this.buildBasePath(owner, name));
  }

  public deactivate(owner: string, name: string): Promise<Repository> {
    return this.baseService.delete<Repository>(this.buildBasePath(owner, name));
  }

  public getBuilds(owner: string, name: string): Promise<Build[]> {
    return this.baseService.get<Build[]>(this.buildBasePath(owner, name) + '/' + 'builds');
  }

  private buildBasePath(owner: string, name: string): string {
    return this.basePath + owner + '/' + name;
  }

}
