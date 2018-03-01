import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {
  CLOUD_TYPE,
  CLUSTER_CLOUD_TYPES,
  ClusterProvider,
  CreateClusterProperties,
  CreateClusterRequest
} from '../../../models/cluster.model';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClusterService} from "../../../services/cluster.service";
import {AlertService} from "ngx-alerts";

@Component({
  selector: 'app-create-cluster',
  templateUrl: './cluster-create.component.html',
  styleUrls: ['./cluster-create.component.scss']
})
export class ClusterCreateComponent implements OnInit {

  public createClusterForm: FormGroup;
  public azureCreateForm: FormGroup;
  public amazonCreateForm: FormGroup;
  public googleCreateForm: FormGroup;

  public providers: Array<ClusterProvider> = [];
  public step = 1;
  public page = 1;
  public secretSearchData = '';
  public selectedCloudType = null;
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
              private router: Router) {
  }

  ngOnInit() {
    this.providers = CLUSTER_CLOUD_TYPES;

    this.initClusterCreateForm();
  }

  createCluster() {
    this.clusterService.createCluster(this.getCreateClusterRq()).then(value => {
      this.router.navigate(['cluster/list'])
    }).catch(reason => this.alertService.danger('Could not launch cluster!'));
  }

  removeSecret(event, id?: number) {
    event.stopPropagation();
  }

  selectCloudType(type: string) {
    this.selectedCloudType = type;
    this.createClusterForm.get('cloud').setValue(type);
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

  isInvalidForm(): boolean {
    return this.createClusterForm.invalid || (this.amazonCreateForm.invalid &&
      this.azureCreateForm.invalid && this.googleCreateForm.invalid);
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
    })
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
    if (this.selectedCloudType === CLOUD_TYPE.AZURE) {
      rqProperties = this.getAzureCreateRqProperties();
    } else if (this.selectedCloudType === CLOUD_TYPE.AMAZON) {
      rqProperties = this.getAmazonCreateRqProperties();
    } else if (this.selectedCloudType === CLOUD_TYPE.GOOGLE) {
      rqProperties = this.getGoogleCreateRqProperties();
    }

    return {
      name: this.createClusterForm.get('name').value,
      cloud: this.createClusterForm.get('cloud').value,
      location: this.createClusterForm.get('location').value,
      nodeInstanceType: this.createClusterForm.get('nodeInstanceType').value,
      properties: rqProperties
    }
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
    }
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
    }
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
    }
  }

}
