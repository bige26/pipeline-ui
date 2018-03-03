import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {SecretService} from '../../../services/secret.service';
import {AlertService} from 'ngx-alerts';

@Component({
  selector: 'app-secret-delete',
  templateUrl: './secret-delete.component.html',
  styleUrls: ['./secret-delete.component.scss']
})
export class SecretDeleteComponent implements OnInit {

  public secretId: number;
  public orgId: number;

  constructor(private bsModalRef: BsModalRef,
              private alertService: AlertService,
              private secretService: SecretService) {
  }

  ngOnInit() {
  }

  close() {
    this.bsModalRef.hide();
  }

  delete() {
    this.bsModalRef.hide();
    this.secretService.deleteSecret(this.secretId, this.orgId).then(value => {
      this.alertService.success('Secret deleted!');
    }).catch(reason => this.alertService.danger('Secret delete error!'));
  }

}
