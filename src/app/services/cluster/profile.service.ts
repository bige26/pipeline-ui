import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {CLOUD_TYPE} from '../../models/cluster/cluster.model';
import {ProfileResponse} from '../../models/cluster/profile.model';

@Injectable()
export class ProfileService {

  private basePath: '/cluster/profiles';

  constructor(private baseService: BaseService) {
  }

  getProfiles(type: CLOUD_TYPE): Promise<ProfileResponse> {
    return this.baseService.get(this.basePath + '/' + type);
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
