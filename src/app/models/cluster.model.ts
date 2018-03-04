export enum CLOUD_TYPE {
  AMAZON = 'amazon',
  AZURE = 'azure',
  GOOGLE = 'google'
}

export interface ClusterProvider {
  id: CLOUD_TYPE;
  imgUrl: string;
}

export const CLUSTER_CLOUD_TYPES: Array<ClusterProvider> = [
  {
    id: CLOUD_TYPE.AZURE,
    imgUrl: 'assets/images/azure.png'
  },
  {
    id: CLOUD_TYPE.AMAZON,
    imgUrl: 'assets/images/aws.png'
  },
  {
    id: CLOUD_TYPE.GOOGLE,
    imgUrl: 'assets/images/google.png'
  }
];

export interface CreateClusterRequest {
  name: string;
  location: string;
  cloud: string;
  nodeInstanceType: string;
  properties: CreateClusterProperties;
}

export interface CreateClusterGoogleProperties {
  project: string;
  node: GoogleNode;
  master: GoogleMaster;
}

export interface GoogleMaster {
  version: string;
}

export interface GoogleNode {
  count: number;
  version: string;
}

export interface CreateClusterProperties {
  amazon: CreateClusterAmazonProperties;
  azure: CreateClusterAzureProperties;
  google: CreateClusterGoogleProperties;
}

export interface CreateClusterAmazonProperties {
  node: CreateAmazonNode;
  master: CreateAmazonMaster;
}

export interface CreateAmazonNode {
  spotPrice: string;
  minCount: number;
  maxCount: number;
  image: string;
}

export interface CreateAmazonMaster {
  instanceType: string;
  image: string;
}

export interface CreateAzureNode {
  resourceGroup: string;
  agentCount: number;
  agentName: string;
  kubernetesVersion: string;
}

export interface CreateClusterAzureProperties {
  node: CreateAzureNode;
}

export interface CreateClusterRequestSuccess {
  status: number;
  message: string;
  resourceId: string;
  name: string;
  Ip: string;
}

export interface AmazonRepresentation {
  ip: string;
}

export interface AzureProfile {
  name: string;
  count: string;
}

export interface AzureProperties {
  provisioningState: string;
  agentPoolProfiles: Array<AzureProfile>;
}

export interface AzureValue {
  id: string;
  location: string;
  name: string;
  properties: AzureProperties;
}

export interface AzureRepresentation {
  value: AzureValue;
}

export interface ClusterRepresentation {
  id: number;
  name: string;
  cloud: string;
  amazon: AmazonRepresentation;
  azure: AzureRepresentation;
}

export interface AwsConfiguration {
  spotPrice: string;
}

export interface IAMPolicy {
  name: string;
  document: string;
  identifier: string;
}

export interface IAMRole {
  kind: string;
  apiVersion: string;
  metadata: Object;
  name: string;
  indentifier: string;
  policies: Array<IAMPolicy>;
}

export interface IAMInstanceProfile {
  kind: string;
  apiVersion: string;
  metadata: Object;
  name: string;
  indentifier: string;
  role: IAMRole;
}

export interface Subnet {
  kind: string;
  apiVersion: string;
  metadata: Object;
  identifier: string;
  cidr: string;
  location: string;
  zone: string;
  name: string;
}

export interface IngressRule {
  kind: string;
  apiVerion: string;
  metadata: Object;
  identifier: string;
  ingressFromPort: string;
  ingressToPort: string;
  ingressSource: string;
  ingressProtocol: string;
}

export interface EgressRule {
  kind: string;
  apiVersion: string;
  metadata: Object;
  identifier: string;
  engressToPort: string;
  engressDestination: string;
  engressProtocol: string;
}

export interface Firewall {
  kind: string;
  apiVersion: string;
  metadata: Object;
  identifier: string;
  ingressRules: Array<IngressRule>;
  egressRules: Array<EgressRule>;
  name: string;
}

export interface Shared {
  kind: string;
  apiVersion: string;
  metadata: Object;
  identifier: string;
}

export interface ServerPool {
  identifier: string;
  minCount: number;
  maxCount: number;
  type: string;
  name: string;
  image: string;
  size: string;
  instanceProfile: IAMInstanceProfile;
  bootstrapScripts: Array<string>;
  subnets: Subnet;
  firewalls: Firewall;
  awsconfiguration: AwsConfiguration;
}

export interface SSH {
  kind: string;
  apiVersion: string;
  metadata: Object;
  name: string;
  user: string;
  identifier: string;
  publicKeyPath: string;
  publicKeyData: Array<number>;
  publicKeyFingerprint: string;
  port: string;
}

export interface InternetGW {
  kind: string;
  apiVersion: string;
  metadata: Object;
  name: string;
  identifier: string;
}

export interface KubicornValues {
  kind: string;
  apiVersion: string;
  metadata: Object;
  itemMap: Map<any, string>;
}

export interface Network {
  kind: string;
  apiVersion: string;
  metadata: Object;
  cidr: string;
  identifier: string;
  type: string;
  internetgw: InternetGW;
}

export interface KubernetesAPI {
  kind: string;
  apiVersion: string;
  metadata: Object;
  endpoint: string;
  port: string;
}

export interface Cluster {
  kind: string;
  apiVersion: string;
  metadata: Object;
  name: string;
  cloudId: string;
  serverPools: Array<ServerPool>;
  cloud: string;
  location: string;
  SSH: SSH;
  network: Network;
  values: KubicornValues;
  kubernetesAPI: KubernetesAPI;
  groupIndentifier: string;
}

export interface GetClusterInfoAmazon {
  status: number;
  data: Cluster;
  Ip: string;
}

export interface GetClusterInfoAzure {
  status_code: number;
  message: AzureValue;
}

export interface UpdateAzureNode {
  agentCount: number;
}

export interface UpdateAmazonNode {
  minCount: number;
  maxCount: number;
}

export interface UpdateClusterAmazon {
  node: UpdateAmazonNode;
}

export interface UpdateClusterAzure {
  node: UpdateAzureNode;
}

export interface UpdateClusterProperties {
  amazon: UpdateClusterAmazon;
  azure: UpdateClusterAzure;
}

export interface UpdateClusterRequest {
  cloud: string;
  properties: UpdateClusterProperties;
}

export interface Status {
  status: number;
}

export interface ClusterSuccessResponse {
  status: string;
  message: string;
  propertyId: number;
}

export interface ClusterStatusResponse {
  status: number;
  message: string;
}

export interface FetchClusterConfigResponse {
  status: number;
  data: string;
}

export interface ClusterRepresentationResponse {
  data: ClusterRepresentation[];
  status: number;
}

export interface ClusterEndpoint {
  name: string;
  host: string;
  urls: string;
}

export interface ClusterEndpointsResponse {
  endpoints: Array<ClusterEndpoint>;
}
