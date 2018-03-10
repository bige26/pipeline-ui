import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {CreateHelmDeploymentResponse, DeploymentStatusResponse, HelmDeploymentType} from '../models/deployment.model';
import {OrganizationService} from './organization.service';

@Injectable()
export class DeploymentService {

  constructor(private baseService: BaseService,
              private orgService: OrganizationService) {
  }

  public listDeployments(id: number): Promise<string> {
    return this.baseService.get<string>(this.getPath() + id + '/deployments');
  }

  public createHelmDeployment(id: number, helmDeploymentType: HelmDeploymentType): Promise<CreateHelmDeploymentResponse> {
    return this.baseService.post<CreateHelmDeploymentResponse>(this.getPath() + id + '/deployments', helmDeploymentType);
  }

  public getTillerStatus(id: number): Promise<DeploymentStatusResponse> {
    return this.baseService.head<DeploymentStatusResponse>(this.getPath() + id + '/deployments');
  }

  public deleteHelmDeployment(id: number, name: string): Promise<DeploymentStatusResponse> {
    return this.baseService.delete<DeploymentStatusResponse>(this.getPath() + id + '/deployments/' + name);
  }

  public getDeploymentStatus(id: number, name: string): Promise<DeploymentStatusResponse> {
    return this.baseService.head<DeploymentStatusResponse>(this.getPath() + id + '/deployments/' + name);
  }

  private getPath(): string {
    const orgId = this.orgService.getCurrentOrganization();
    return '/pipeline/api/v1/org/' + orgId + '/clusters/';
  }

}
