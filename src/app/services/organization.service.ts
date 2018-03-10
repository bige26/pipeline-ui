import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {OrganizationListItemResponse} from '../models/organization.model';

@Injectable()
export class OrganizationService {

  private basePath = '/pipeline/api/v1/orgs';
  private org = 'ORGANIZATION';

  constructor(private baseService: BaseService) {
  }

  getOrgranization(id: number): Promise<OrganizationListItemResponse> {
    return this.baseService.get<OrganizationListItemResponse>(this.basePath + '/' + id);
  }

  getOrgranizations(): Promise<Array<OrganizationListItemResponse>> {
    return this.baseService.get<Array<OrganizationListItemResponse>>(this.basePath);
  }

  getCurrentOrganization(): string {
    return sessionStorage.getItem(this.org);
  }

  setCurrentOrganization(org: string) {
    sessionStorage.setItem(this.org, org);
  }

}
