import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {
  ClusterEndpointsResponse,
  ClusterRepresentationResponse,
  ClusterStatusResponse,
  ClusterSuccessResponse,
  CreateClusterRequest,
  CreateClusterRequestSuccess,
  FetchClusterConfigResponse,
  GetClusterInfoAmazon,
  GetClusterInfoAzure,
  UpdateClusterRequest
} from '../../models/cluster/cluster.model';
import {BansaiHelmInstall} from '../../models/deployment.model';
import {OrganizationService} from '../organization.service';

@Injectable()
export class ClusterService {

  constructor(private baseService: BaseService,
              private orgService: OrganizationService) {
  }

  public getClusters(): Promise<ClusterRepresentationResponse> {
    return this.baseService.get<ClusterRepresentationResponse>(this.getPath());
  }

  public createCluster(cluster: CreateClusterRequest): Promise<CreateClusterRequestSuccess> {
    return this.baseService.post<CreateClusterRequestSuccess>(this.getPath(), cluster);
  }

  public deleteCluster(id: number): Promise<ClusterSuccessResponse> {
    return this.baseService.delete<ClusterSuccessResponse>(this.getPath(), id);
  }

  public fetchClusterAmazon(id: number): Promise<GetClusterInfoAmazon> {
    return this.baseService.get<GetClusterInfoAmazon>(this.getPath(), id);
  }

  public fetchClusterAzure(id: number): Promise<GetClusterInfoAzure> {
    return this.baseService.get<GetClusterInfoAzure>(this.getPath(), id);
  }

  public updateCluster(updateClusterRq: UpdateClusterRequest): Promise<ClusterSuccessResponse> {
    return this.baseService.put<ClusterSuccessResponse>(this.getPath(), updateClusterRq);
  }

  public fetchClusterStatus(id: number): Promise<ClusterStatusResponse> {
    return this.baseService.head<ClusterStatusResponse>(this.getPath(), id);
  }

  public fetchClusterConfig(id: number): Promise<FetchClusterConfigResponse> {
    return this.baseService.get<FetchClusterConfigResponse>(this.getPath() + '/' + id + '/config');
  }

  public getPublicEndpoints(id: number): Promise<ClusterEndpointsResponse> {
    return this.baseService.get<ClusterEndpointsResponse>(this.getPath() + '/' + id + '/endpoints');
  }

  public initHelmCluster(id: number, bansaiHelmInstall: BansaiHelmInstall): Promise<BansaiHelmInstall> {
    return this.baseService.post(this.getPath() + '/' + id + '/helminit', bansaiHelmInstall);
  }

  private getPath(): string {
    const orgId = this.orgService.getCurrentOrganization();
    return '/pipeline/api/v1/org/' + orgId + '/clusters';
  }

}
