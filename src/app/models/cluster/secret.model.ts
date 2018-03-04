import {CLOUD_TYPE} from './cluster.model';

export enum SECRET_TYPES {
  AMAZON = 'AMAZON_SECRET',
  AZURE = 'AZURE_SECRET',
  GOOGLE = 'GOOGLE_SECRET'
}

export const SECRET_CLOUD_TYPE: Map<CLOUD_TYPE, SECRET_TYPES> = new Map<CLOUD_TYPE, SECRET_TYPES>()
  .set(CLOUD_TYPE.AMAZON, SECRET_TYPES.AMAZON)
  .set(CLOUD_TYPE.AZURE, SECRET_TYPES.AZURE)
  .set(CLOUD_TYPE.GOOGLE, SECRET_TYPES.GOOGLE);

export enum AMAZON_SECRET_VALUE_KEYS {
  AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID',
  AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY'
}

export enum AZURE_SECRET_VALUE_KEYS {
  AZURE_CLIENT_SECRET = 'AZURE_CLIENT_SECRET',
  AZURE_CLIENT_ID = 'AZURE_CLIENT_ID',
  AZURE_TENANT_ID = 'AZURE_TENANT_ID',
  AZURE_SUBSCRIPTION_ID = 'AZURE_SUBSCRIPTION_ID'
}

export interface SecretValue {
  key: AMAZON_SECRET_VALUE_KEYS | AZURE_SECRET_VALUE_KEYS;
  value: string;
}

export interface SecretResponse {
  secrets: Array<Secret>;
}

export interface Secret {
  id: number;
  name: string;
  type: SECRET_TYPES;
  values: Array<SecretValue>;
}

export interface CreateSecret {
  name: string;
  type: SECRET_TYPES,
  values: Array<SecretValue>;
}
