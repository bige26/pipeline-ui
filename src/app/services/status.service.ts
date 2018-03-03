import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {Status} from '../models/cluster.model';

@Injectable()
export class StatusService {

  private basePath = '/pipeline/api/v1/status';

  constructor(private baseService: BaseService) {
  }

  public getStatus(): Promise<Status> {
    return this.baseService.get<Status>(this.basePath);
  }

}
