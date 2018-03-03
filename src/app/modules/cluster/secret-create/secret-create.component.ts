import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {SecretService} from '../../../services/secret.service';
import {CLOUD_TYPE} from '../../../models/cluster.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AMAZON_SECRET_VALUE_KEYS, AZURE_SECRET_VALUE_KEYS, CreateSecret, SECRET_TYPES, SecretValue} from '../../../models/secret.model';
import {AlertService} from 'ngx-alerts';

@Component({
  selector: 'app-secret-create',
  templateUrl: './secret-create.component.html',
  styleUrls: ['./secret-create.component.scss']
})
export class SecretCreateComponent implements OnInit {

  public secretType: CLOUD_TYPE;
  public amazonSecretForm: FormGroup;
  public azureSecretForm: FormGroup;
  public googleSecretForm: FormGroup;

  constructor(public bsModalRef: BsModalRef,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private secretService: SecretService) {
  }

  ngOnInit() {
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

  close() {
    this.bsModalRef.hide();
    console.log(this.secretType);
  }

  create() {
    let secretRq: CreateSecret;
    switch (this.secretType) {
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

    // TODO: refresh secret list
    this.secretService.createSecret(secretRq).then(value => {
      this.alertService.success('Secrets created!');
      this.bsModalRef.hide();
    }).catch(reason => {
      this.alertService.danger('Secrets create error!');
    });
  }

  isInvalidForm(): boolean {
    switch (this.secretType) {
      case CLOUD_TYPE.AZURE:
        return this.azureSecretForm.invalid;
      case CLOUD_TYPE.AMAZON:
        return this.amazonSecretForm.invalid;
      case CLOUD_TYPE.GOOGLE:
        return this.googleSecretForm.invalid;
    }
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

