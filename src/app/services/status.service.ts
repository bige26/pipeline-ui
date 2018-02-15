import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {Status} from '../models/cluster.model';

@Injectable()
export class StatusService {

  private basePath = '/status';

  constructor(private baseService: BaseService) {
  }

  public getStatus(): Promise<Status> {
    return this.baseService.get<Status>(this.basePath);
  }

}
