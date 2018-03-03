import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {RepositoryService} from '../../../services/repository.service';
import {Repository} from '../../../models/repository';
import {Secret} from '../../../models/secret';
import {Registry} from '../../../models/registry';
import {AlertService} from 'ngx-alerts';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public isOpenSettings = false;
  public isOpenRegistry = false;
  public isOpenSecrets = false;
  public settingsForm: FormGroup = new FormGroup({});
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public repository: Repository = null;
  public secrets: Secret[] = [];
  public registries: Registry[] = [];
  public title: string;
  public deletedSecretName: string;
  public deletedRegistryName: string;
  
  public secretsForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    value: new FormControl('')
  });

  public registryForm: FormGroup = new FormGroup({
    address: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private route: ActivatedRoute,
              private router: Router,
              private repositoryService: RepositoryService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.isLoading.next(true);
    this.route.params.subscribe(params => {
      this.repositoryService.getRepositoy(params['user'], params['repo']).then(resp => {
        this.repository = resp;
        this.settingsForm = new FormGroup({
          allow_pr: new FormControl(this.repository.allow_pr),
          allow_push: new FormControl(this.repository.allow_push),
          allow_deploy: new FormControl(this.repository.allow_deploys),
          allow_tag: new FormControl(this.repository.allow_tags),
          timeout: new FormControl(this.repository.timeout),
          visibility: new FormControl(this.repository.visibility),
          private: new FormControl(this.repository.private),
          trusted: new FormControl(this.repository.trusted),
          gated: new FormControl(this.repository.gated),
        });
        this.isLoading.next(false);
      });
      this.repositoryService.getSecrets(params['user'], params['repo']).then(resp => {
        this.secrets = resp;
      });
      this.repositoryService.getRegistries(params['user'], params['repo']).then(resp => {
        this.registries = resp;
      });
      this.title = params['user'] + '/' + params['repo'];
    });
  }

  public openRepositories() {
    this.router.navigate(['drone/repositroy']);
  }

  public deleteSecret() {

    this.repositoryService.deleteSecret(this.repository.owner, this.repository.name, this.deletedSecretName).then(_ => {
      this.alertService.success('Successfully removed the secret');
      this.repositoryService.getSecrets(this.repository.owner, this.repository.name).then(resp => {
        this.secrets = resp;
      });
    });
  }

  public deleteRegistry() {

    this.repositoryService.deleteRegistry(this.repository.owner, this.repository.name, this.deletedRegistryName).then(_ => {
      this.alertService.success('Successfully deleted the registry credentials');
      this.repositoryService.getRegistries(this.repository.owner, this.repository.name).then(resp => {
        this.registries = resp;
      });
    });
  }

  public saveSettings() {
    this.repositoryService.saveSettings(this.repository.owner, this.repository.name, this.settingsForm.value).then(_ => {
      this.alertService.success('Successfully updated the repository settings');
    });
  }

  public saveRegistry() {
    this.repositoryService.saveRegistry(this.repository.owner, this.repository.name, this.registryForm.value).then(_ => {
      this.alertService.success('Successfully stored the registry credentials');
      this.repositoryService.getRegistries(this.repository.owner, this.repository.name).then(resp => {
        this.registries = resp;
        this.registryForm.reset();
      });
    });
  }

  public saveSecrets() {

    const request: Secret = this.secretsForm.value;
    request.event = ['push', 'tag', 'deployment'];

    this.repositoryService.saveSecret(this.repository.owner, this.repository.name, request).then(_ => {
      this.alertService.success('Successfully added the secret');
      this.repositoryService.getSecrets(this.repository.owner, this.repository.name).then(resp => {
        this.secrets = resp;
        this.secretsForm.reset();
      });
    });
  }

}
