import {AmazonClusterProperties, AzureClusterProperties, GoogleClusterProperties} from './cluster.model';

export interface ProfileResponse {
  profiles: Array<ProfileRepresentation>;
}

export interface ProfileRepresentation {
  instanceName: string;
  location: string;
  cloud: string;
  nodeInstanceType: string;
  properties: ProfileProperties;
}

export interface ProfileProperties {
  amazon: AmazonClusterProperties;
  azure: AzureClusterProperties;
  google: GoogleClusterProperties;
}
