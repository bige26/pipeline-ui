import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {
  ClusterRepresentationResponse,
  ClusterStatusResponse,
  ClusterSuccessResponse,
  CreateClusterRequest,
  CreateClusterRequestSuccess,
  FetchClusterConfigResponse,
  GetClusterInfoAmazon,
  GetClusterInfoAzure,
  UpdateClusterRequest
} from '../models/cluster.model';
import {BansaiHelmInstall} from '../models/deployment.model';

@Injectable()
export class ClusterService {

  private basePath = '/clusters';

  constructor(private baseService: BaseService) {
  }

  public getClusters(): Promise<ClusterRepresentationResponse> {
    return this.baseService.get<ClusterRepresentationResponse>(this.basePath);
  }

  public createCluster(cluster: CreateClusterRequest): Promise<CreateClusterRequestSuccess> {
    return this.baseService.post<CreateClusterRequestSuccess>(this.basePath, cluster);
  }

  public deleteCluster(id: number): Promise<ClusterSuccessResponse> {
    return this.baseService.delete<ClusterSuccessResponse>(this.basePath, id);
  }

  public fetchClusterAmazon(id: number): Promise<GetClusterInfoAmazon> {
    return this.baseService.get<GetClusterInfoAmazon>(this.basePath, id);
  }

  public fetchClusterAzure(id: number): Promise<GetClusterInfoAzure> {
    return this.baseService.get<GetClusterInfoAzure>(this.basePath, id);
  }

  public updateCluster(updateClusterRq: UpdateClusterRequest): Promise<ClusterSuccessResponse> {
    return this.baseService.put<ClusterSuccessResponse>(this.basePath, updateClusterRq);
  }

  public fetchClusterStatus(id: number): Promise<ClusterStatusResponse> {
    return this.baseService.head<ClusterStatusResponse>(this.basePath, id);
  }

  public fetchClusterConfig(id: number): Promise<FetchClusterConfigResponse> {
    return this.baseService.get<FetchClusterConfigResponse>(this.basePath + id + '/config');
  }

  // TODO: response type missing
  public getPublicEndpoints(id: number): Promise<any> {
    return this.baseService.get(this.basePath + id + '/endpoints');
  }

  public initHelmCluster(id: number, bansaiHelmInstall: BansaiHelmInstall): Promise<BansaiHelmInstall> {
    return this.baseService.post(this.basePath + id + '/helminit', bansaiHelmInstall);
  }

}
