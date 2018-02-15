import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {CreateHelmDeploymentResponse, DeploymentStatusResponse, HelmDeploymentType} from '../models/deployment.model';

@Injectable()
export class DeploymentService {

  private basePath = '/clusters/';

  constructor(private baseService: BaseService) {
  }

  public listDeployments(id: number): Promise<string> {
    return this.baseService.get<string>(this.basePath + id + '/deployments');
  }

  public createHelmDeployment(id: number, helmDeploymentType: HelmDeploymentType): Promise<CreateHelmDeploymentResponse> {
    return this.baseService.post<CreateHelmDeploymentResponse>(this.basePath + id + '/deployments', helmDeploymentType);
  }

  public getTillerStatus(id: number): Promise<DeploymentStatusResponse> {
    return this.baseService.head<DeploymentStatusResponse>(this.basePath + id + '/deployments');
  }

  public deleteHelmDeployment(id: number, name: string): Promise<DeploymentStatusResponse> {
    return this.baseService.delete<DeploymentStatusResponse>(this.basePath + id + '/deployments/' + name);
  }

  public getDeploymentStatus(id: number, name: string): Promise<DeploymentStatusResponse> {
    return this.baseService.head<DeploymentStatusResponse>(this.basePath + id + '/deployments/' + name);
  }

}
