import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {
  CLOUD_TYPE,
  CLUSTER_CLOUD_TYPES,
  ClusterProvider,
  CreateClusterProperties,
  CreateClusterRequest
} from '../../../models/cluster.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClusterService} from '../../../services/cluster.service';
import {AlertService} from 'ngx-alerts';
import {
  AMAZON_SECRET_VALUE_KEYS,
  AZURE_SECRET_VALUE_KEYS,
  CreateSecret,
  Secret,
  SECRET_CLOUD_TYPE,
  SECRET_TYPES,
  SecretValue
} from '../../../models/secret.model';
import {SecretService} from '../../../services/secret.service';
import {Modal} from 'ngx-modal';

@Component({
  selector: 'app-create-cluster',
  templateUrl: './cluster-create.component.html',
  styleUrls: ['./cluster-create.component.scss']
})
export class ClusterCreateComponent implements OnInit {

  // Cluster forms
  public createClusterForm: FormGroup;
  public azureCreateForm: FormGroup;
  public amazonCreateForm: FormGroup;
  public googleCreateForm: FormGroup;

  // Secret forms
  public amazonSecretForm: FormGroup;
  public azureSecretForm: FormGroup;
  public googleSecretForm: FormGroup;

  public secrets: Array<Secret> = [];
  public providers: Array<ClusterProvider> = [];
  public step = 1;
  public page = 1;
  public secretSearchData = '';
  public selectedCloudType = null;
  public selectedSecretId: number;
  public steps: Array<{ step: number, label: string, status: string }> = [
    {
      step: 1,
      label: 'Choose provider',
      status: ''
    },
    {
      step: 2,
      label: 'Choose provider config',
      status: ''
    },
    {
      step: 3,
      label: 'Configure provider',
      status: ''
    }
  ];

  constructor(private alertService: AlertService,
              private clusterService: ClusterService,
              private formBuilder: FormBuilder,
              private secretService: SecretService,
              private router: Router) {
  }

  ngOnInit() {
    this.providers = CLUSTER_CLOUD_TYPES;

    this.initClusterCreateForm();
    this.initSecretCreateForm();
  }

  createCluster() {
    this.clusterService.createCluster(this.getCreateClusterRq()).then(value => {
      this.router.navigate(['cluster/list']);
    }).catch(reason => this.alertService.danger('Could not launch cluster!'));
  }

  createSecret() {
    let secretRq: CreateSecret;
    switch (this.selectedCloudType) {
      case CLOUD_TYPE.AZURE: {
        secretRq = {
          name: this.azureSecretForm.get('name').value,
          type: SECRET_TYPES.AZURE,
          values: this.getAzureSecretValues()
        };
        break;
      }
      case CLOUD_TYPE.AMAZON: {
        secretRq = {
          name: this.amazonSecretForm.get('name').value,
          type: SECRET_TYPES.AMAZON,
          values: this.getAmazonSecretValues()
        };
        break;
      }
      case CLOUD_TYPE.GOOGLE: {
      }
    }

    this.secretService.createSecret(secretRq).then(value => {
      this.alertService.success('Secrets created!');
      // TODO: refresh secret list
    }).catch(reason => {
      this.alertService.danger('Secrets create error!');
    });
  }

  deleteSecret() {
    this.secretService.deleteSecret(this.selectedSecretId).then(value => {
      this.alertService.success('Secret deleted!');
    }).catch(reason => this.alertService.danger('Secret delete error!'));
  }

  openCreateSecretDialog(modal: Modal) {
    modal.open();
  }

  openDeleteModal(event, id: number, deleteModal: Modal) {
    event.stopPropagation();
    this.selectedSecretId = id;
    deleteModal.open();
  }

  selectCloudType(type: string) {
    this.selectedCloudType = type;
    this.createClusterForm.get('cloud').setValue(type);
    this.initSecrets();
    this.nextStep();
  }

  jumpStep(step: number) {
    if (step >= this.step) {
      return;
    } else {
      this.step = step;
      this.steps.forEach((value, index) => {
        if (index >= this.step - 1) {
          value.status = '';
        }
      });
    }
    this.resetCreateClusterForm();
  }

  nextStep() {
    this.steps[this.step - 1].status = 'done';
    this.step++;
  }

  getCurrentStep(): number {
    return this.step;
  }

  isInvalidClusterForm(): boolean {
    return this.createClusterForm.invalid || (this.amazonCreateForm.invalid &&
      this.azureCreateForm.invalid && this.googleCreateForm.invalid);
  }

  isInvalidSecretForm(): boolean {
    switch (this.selectedCloudType) {
      case CLOUD_TYPE.AZURE:
        return this.azureSecretForm.invalid;
      case CLOUD_TYPE.AMAZON:
        return this.amazonSecretForm.invalid;
      case CLOUD_TYPE.GOOGLE:
        return this.googleSecretForm.invalid;
    }
  }

  private initSecrets() {
    this.secretService.getSecrets().then(value => {
    });
    this.secrets = this.secrets.filter(_ => _.type === SECRET_CLOUD_TYPE.get(this.selectedCloudType));
  }

  private initSecretCreateForm() {
    this.amazonSecretForm = this.formBuilder.group({
      name: ['', Validators.required],
      accessKeyId: ['', Validators.required],
      secretAccessKeyId: ['', Validators.required]
    });
    this.azureSecretForm = this.formBuilder.group({
      name: ['', Validators.required],
      clientSecret: ['', Validators.required],
      clientId: ['', Validators.required],
      tenantId: ['', Validators.required],
      subscriptionId: ['', Validators.required]
    });
  }

  private initClusterCreateForm() {
    this.createClusterForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      cloud: ['', Validators.required],
      nodeInstanceType: ['', Validators.required]
    });
    this.amazonCreateForm = this.formBuilder.group({
      spotPrice: [''],
      minCount: ['', Validators.required],
      maxCount: ['', Validators.required],
      amazonNodeImage: [''],
      instanceType: [''],
      amazonMasterImage: [''],
      amazonNodeInstanceType: ['']
    });
    this.azureCreateForm = this.formBuilder.group({
      resourceGroup: ['', Validators.required],
      agentCount: ['', Validators.required],
      agentName: [''],
      kubernetesVersion: ['']
    });
    this.googleCreateForm = this.formBuilder.group({
      project: ['', Validators.required],
      masterVersion: [''],
      nodeVersion: [''],
      count: ['']
    });
  }

  private resetCreateClusterForm() {
    this.createClusterForm.reset({
      cloud: this.selectedCloudType
    });
    this.amazonCreateForm.reset();
    this.azureCreateForm.reset();
    this.googleCreateForm.reset();
  }

  private resetSecretForms() {
    this.amazonSecretForm.reset();
    this.azureSecretForm.reset();
    // this.googleSecretForm.reset();
  }

  private getCreateClusterRq(): CreateClusterRequest {
    let rqProperties: CreateClusterProperties;
    switch (this.selectedCloudType) {
      case CLOUD_TYPE.AZURE: {
        rqProperties = this.getAzureCreateRqProperties();
        break;
      }
      case CLOUD_TYPE.AMAZON: {
        rqProperties = this.getAmazonCreateRqProperties();
        break;
      }
      case CLOUD_TYPE.GOOGLE: {
        rqProperties = this.getGoogleCreateRqProperties();
      }
    }
    return {
      name: this.createClusterForm.get('name').value,
      cloud: this.createClusterForm.get('cloud').value,
      location: this.createClusterForm.get('location').value,
      nodeInstanceType: this.createClusterForm.get('nodeInstanceType').value,
      properties: rqProperties
    };
  }

  private getGoogleCreateRqProperties(): CreateClusterProperties {
    return {
      google: {
        project: this.googleCreateForm.get('project').value,
        master: {
          version: this.googleCreateForm.get('masterVersion').value
        },
        node: {
          count: this.googleCreateForm.get('count').value,
          version: this.googleCreateForm.get('nodeVersion').value
        }
      },
      amazon: null,
      azure: null
    };
  }

  private getAmazonCreateRqProperties(): CreateClusterProperties {
    return {
      amazon: {
        node: {
          image: this.amazonCreateForm.get('amazonNodeImage').value,
          minCount: this.amazonCreateForm.get('minCount').value,
          maxCount: this.amazonCreateForm.get('maxCount').value,
          spotPrice: this.amazonCreateForm.get('spotPrice').value
        },
        master: {
          instanceType: this.amazonCreateForm.get('amazonNodeInstanceType').value,
          image: this.amazonCreateForm.get('amazonMasterImage').value
        }
      },
      azure: null,
      google: null
    };
  }

  private getAzureCreateRqProperties(): CreateClusterProperties {
    return {
      azure: {
        node: {
          agentCount: this.azureCreateForm.get('agentCount').value,
          agentName: this.azureCreateForm.get('agentName').value,
          kubernetesVersion: this.azureCreateForm.get('kubernetesVersion').value,
          resourceGroup: this.azureCreateForm.get('resourceGroup').value
        }
      },
      amazon: null,
      google: null
    };
  }

  private getAmazonSecretValues(): Array<SecretValue> {
    return [
      {
        key: AMAZON_SECRET_VALUE_KEYS.AWS_ACCESS_KEY_ID,
        value: this.amazonSecretForm.get('accessKeyId').value
      },
      {
        key: AMAZON_SECRET_VALUE_KEYS.AWS_SECRET_ACCESS_KEY,
        value: this.amazonSecretForm.get('secretAccessKeyId').value
      }];
  }

  private getAzureSecretValues(): Array<SecretValue> {
    return [
      {
        key: AZURE_SECRET_VALUE_KEYS.AZURE_CLIENT_SECRET,
        value: this.azureSecretForm.get('clientSecret').value
      },
      {
        key: AZURE_SECRET_VALUE_KEYS.AZURE_CLIENT_ID,
        value: this.azureSecretForm.get('clientId').value
      },
      {
        key: AZURE_SECRET_VALUE_KEYS.AZURE_SUBSCRIPTION_ID,
        value: this.azureSecretForm.get('subscriptionId').value
      },
      {
        key: AZURE_SECRET_VALUE_KEYS.AZURE_TENANT_ID,
        value: this.azureSecretForm.get('tenantId').value
      }
    ];
  }

}
