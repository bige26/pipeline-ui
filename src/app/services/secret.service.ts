import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {CreateSecret, SecretResponse} from '../models/secret.model';

@Injectable()
export class SecretService {

  constructor(private baseService: BaseService) {
  }

  getSecrets(orgId: number = 1): Promise<SecretResponse> {
    return this.baseService.get<SecretResponse>(this.createPath(orgId));
  }

  createSecret(secret: CreateSecret, orgId: number = 1) {
    return this.baseService.post(this.createPath(orgId), secret);
  }

  deleteSecret(id: number, orgId: number = 1) {
    return this.baseService.delete(this.createPath(orgId) + '/' + id);
  }

  private createPath(orgId: number) {
    return `/pipeline/api/v1/org/${orgId}/secrets`;
  }


}
