export interface HelmDeploymentType {
  name: string;
  releasename: string;
  version: string;
  values: Object;
}

export interface BansaiHelmInstall {
  kube_context: string;
  namespace: string;
  upgrade: boolean;
  service_account: string;
  canary_image: boolean;
  tiller_image: string;
  history_max: number;
}

export interface CreateHelmDeploymentResponse {
  status: Object;
  release_name: string;
  notes: string;
}

export interface DeploymentStatusResponse {
  status: number;
  message: string;
}
