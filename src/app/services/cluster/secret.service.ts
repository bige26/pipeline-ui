import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {CreateSecret, SecretResponse} from '../../models/cluster/secret.model';
import {OrganizationService} from '../organization.service';

@Injectable()
export class SecretService {

  constructor(private baseService: BaseService,
              private orgService: OrganizationService) {
  }

  getSecrets(): Promise<SecretResponse> {
    return this.baseService.get<SecretResponse>(this.getPath());
  }

  createSecret(secret: CreateSecret) {
    return this.baseService.post(this.getPath(), secret);
  }

  deleteSecret(id: number) {
    return this.baseService.delete(this.getPath() + '/' + id);
  }

  private getPath(): string {
    const orgId = this.orgService.getCurrentOrganization();
    return '/pipeline/api/v1/org/' + orgId + '/secrets';
  }

}
