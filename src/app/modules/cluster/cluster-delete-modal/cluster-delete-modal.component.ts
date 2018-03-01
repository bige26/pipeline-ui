import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {ClusterService} from "../../../services/cluster.service";
import {AlertService} from "ngx-alerts";

@Component({
  selector: 'app-cluster-delete-modal',
  templateUrl: './cluster-delete-modal.component.html',
  styleUrls: ['./cluster-delete-modal.component.scss']
})
export class ClusterDeleteModalComponent implements OnInit {

  public clusterName: string;
  public clusterConfirmName: string;
  public clusterId: number;

  constructor(private alertService: AlertService,
              private bsModalRef: BsModalRef,
              private clusterService: ClusterService) {
  }

  ngOnInit() {
  }

  close() {
    this.bsModalRef.hide();
  }

  delete() {
    this.bsModalRef.hide();
    this.clusterService.deleteCluster(this.clusterId).then(value => {
      this.alertService.success(value.message);
    });
  }

}
