import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {CLOUD_TYPE} from '../../models/cluster/cluster.model';
import {ProfileRepresentation} from '../../models/cluster/profile.model';

@Injectable()
export class ProfileService {

  private basePath = '/pipeline/api/v1/cluster/profiles';

  constructor(private baseService: BaseService) {
  }

  getProfiles(type: CLOUD_TYPE): Promise<ProfileRepresentation[]> {
    return this.baseService.get<ProfileRepresentation[]>(this.basePath + '/' + type);
  }

  createProfile() {
    return this.baseService.post(this.basePath);
  }

  updateProfile(type: CLOUD_TYPE) {
    return this.baseService.put(this.basePath + '/' + type, {});
  }

  deleteProfile(type: CLOUD_TYPE, name: string) {
    return this.baseService.delete(this.basePath + '/' + type + '/' + name);
  }

}
