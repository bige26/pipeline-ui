import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {CLOUD_TYPE} from '../../models/cluster/cluster.model';
import {ProfileRepresentation} from '../../models/cluster/profile.model';
import {OrganizationService} from '../organization.service';

@Injectable()
export class ProfileService {

  constructor(private baseService: BaseService,
              private orgService: OrganizationService) {
  }

  getProfiles(type: CLOUD_TYPE): Promise<ProfileRepresentation[]> {
    return this.baseService.get<ProfileRepresentation[]>(this.getPath() + '/' + type);
  }

  createProfile() {
    return this.baseService.post(this.getPath());
  }

  updateProfile(type: CLOUD_TYPE) {
    return this.baseService.put(this.getPath() + '/' + type, {});
  }

  deleteProfile(type: CLOUD_TYPE, name: string) {
    return this.baseService.delete(this.getPath() + '/' + type + '/' + name);
  }

  private getPath(): string {
    const orgId = this.orgService.getCurrentOrganization();
    return '/pipeline/api/v1/org/' + orgId + '/clusters/profiles';
  }

}
