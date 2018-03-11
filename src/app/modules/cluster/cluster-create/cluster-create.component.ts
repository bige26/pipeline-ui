import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {
  CLOUD_TYPE,
  CLUSTER_CLOUD_TYPES,
  ClusterProvider,
  CreateClusterProperties,
  CreateClusterRequest
} from '../../../models/cluster/cluster.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ClusterService} from '../../../services/cluster/cluster.service';
import {AlertService} from 'ngx-alerts';
import {
  AMAZON_SECRET_VALUE_KEYS,
  AZURE_SECRET_VALUE_KEYS,
  CreateSecret,
  Secret,
  SECRET_CLOUD_TYPE,
  SECRET_TYPES,
  SecretValue
} from '../../../models/cluster/secret.model';
import {SecretService} from '../../../services/cluster/secret.service';
import {Modal} from 'ngx-modal';
import {ProfileService} from '../../../services/cluster/profile.service';
import {ProfileRepresentation} from '../../../models/cluster/profile.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-create-cluster',
  templateUrl: './cluster-create.component.html',
  styleUrls: ['./cluster-create.component.scss']
})
export class ClusterCreateComponent implements OnInit, OnDestroy {

  // Cluster forms
  public createClusterForm: FormGroup;
  public azureCreateForm: FormGroup;
  public amazonCreateForm: FormGroup;
  public googleCreateForm: FormGroup;

  // Secret forms
  public amazonSecretForm: FormGroup;
  public azureSecretForm: FormGroup;
  public googleSecretForm: FormGroup;

  public profileControl: FormControl = new FormControl();

  public secrets: Array<Secret> = [];
  public providers: Array<ClusterProvider> = [];
  public profiles: Array<ProfileRepresentation> = [];
  public step = 1;
  public page = 1;
  public secretSearchData = '';
  public selectedCloudType = null;
  public selectedSecretId: number;
  public isLoading = false;
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

  private profileChangeSub: Subscription;

  constructor(private alertService: AlertService,
              private clusterService: ClusterService,
              private formBuilder: FormBuilder,
              private secretService: SecretService,
              private profileService: ProfileService,
              private router: Router) {
  }

  ngOnInit() {
    this.providers = CLUSTER_CLOUD_TYPES;

    this.initSecretCreateForm();
    this.initClusterCreateForm();
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
      this.refreshSecrets();
    }).catch(reason => {
      this.alertService.danger('Secrets create error!');
    });
  }

  deleteSecret() {
    this.secretService.deleteSecret(this.selectedSecretId).then(value => {
      this.alertService.success('Secret deleted!');
      this.refreshSecrets();
    }).catch(reason => this.alertService.danger('Secret delete error!'));
  }

  openDeleteModal(event, id: number, deleteModal: Modal) {
    event.stopPropagation();
    this.selectedSecretId = id;
    deleteModal.open();
  }

  selectCloudType(type: string) {
    this.selectedCloudType = type;
    this.createClusterForm.get('cloud').setValue(this.selectedCloudType);
    this.refreshSecrets();
    this.nextStep();
  }

  selectSecret(secret: Secret) {
    this.profileService.getProfiles(this.selectedCloudType).then(value => {
      this.profiles = value;

      // set up default config
      const defaultConfig = this.profiles.find(item => item.instanceName === 'default');
      this.profileControl.setValue(defaultConfig.instanceName);
    });

    // subscribe to profile select change
    this.profileChangeSub = this.profileControl.valueChanges.subscribe(value => {
      if (value) {
        this.updateConfigForm(value);
      }
    });

    this.nextStep();
  }

  updateConfigForm(value) {
    const selected: ProfileRepresentation = this.profiles.find(item => item.instanceName === value);
    this.createClusterForm.setValue({
      name: selected.instanceName,
      location: selected.location,
      cloud: this.selectedCloudType,
      nodeInstanceType: selected.nodeInstanceType
    });
    switch (this.selectedCloudType) {
      case CLOUD_TYPE.AMAZON: {
        this.amazonCreateForm.get('amazonNodeImage').setValue(selected.properties.amazon.node.image);
        this.amazonCreateForm.get('spotPrice').setValue(selected.properties.amazon.node.spotPrice);
        this.amazonCreateForm.get('minCount').setValue(selected.properties.amazon.node.minCount);
        this.amazonCreateForm.get('maxCount').setValue(selected.properties.amazon.node.maxCount);
        this.amazonCreateForm.get('amazonMasterInstanceType').setValue(
          selected.properties.amazon.master.instanceType);
        this.amazonCreateForm.get('amazonMasterImage').setValue(selected.properties.amazon.master.image);
        break;
      }
      case CLOUD_TYPE.AZURE: {
        this.azureCreateForm.get('resourceGroup').setValue(selected.properties.azure.node.resourceGroup);
        this.azureCreateForm.get('agentCount').setValue(selected.properties.azure.node.agentCount);
        this.azureCreateForm.get('agentName').setValue(selected.properties.azure.node.agentName);
        this.azureCreateForm.get('kubernetesVersion').setValue(selected.properties.azure.node.kubernetesVersion);
        break;
      }
      case CLOUD_TYPE.GOOGLE: {
        this.googleCreateForm.get('project').setValue(selected.properties.google.project);
        this.googleCreateForm.get('masterVersion').setValue(selected.properties.google.master.version);
        this.googleCreateForm.get('nodeVersion').setValue(selected.properties.google.node.version);
        this.googleCreateForm.get('count').setValue(selected.properties.google.node.count);
        break;
      }
    }
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

    this.profileControl.reset();
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
      // case CLOUD_TYPE.GOOGLE:
      //   return this.googleSecretForm.invalid;
    }
  }

  resetSecretForms() {
    this.amazonSecretForm.reset();
    this.azureSecretForm.reset();
    // this.googleSecretForm.reset();
  }

  ngOnDestroy() {
    if (this.profileChangeSub) {
      this.profileChangeSub.unsubscribe();
    }
  }

  private refreshSecrets() {
    this.startLoading();
    this.secretService.getSecrets().then(value => {
      this.secrets = value.secrets.filter(secret =>
        secret.type === SECRET_CLOUD_TYPE.get(this.selectedCloudType));
      this.stopLoading();
    }).catch(reason => this.stopLoading());
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
      cloud: [this.selectedCloudType, Validators.required],
      nodeInstanceType: ['', Validators.required]
    });
    this.amazonCreateForm = this.formBuilder.group({
      spotPrice: [''],
      minCount: ['', Validators.required],
      maxCount: ['', Validators.required],
      amazonNodeImage: [''],
      amazonMasterImage: [''],
      amazonMasterInstanceType: ['']
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
          instanceType: this.amazonCreateForm.get('amazonMasterInstanceType').value,
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

  private startLoading() {
    this.isLoading = true;
  }

  private stopLoading() {
    this.isLoading = false;
  }

}
