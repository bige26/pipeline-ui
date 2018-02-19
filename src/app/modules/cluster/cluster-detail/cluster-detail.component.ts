import {Component, Input, OnInit} from '@angular/core';
import {ClusterRepresentation} from "../../../models/cluster.model";
import {ClusterService} from "../../../services/cluster.service";
import {AlertService} from "ngx-alerts";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-cluster-detail',
  templateUrl: './cluster-detail.component.html',
  styleUrls: ['./cluster-detail.component.scss']
})
export class ClusterDetailComponent implements OnInit {

  @Input() cluster: ClusterRepresentation;

  private CLUSTER_CONFIG_FILE_NAME = 'config.yaml';

  constructor(private clusterService: ClusterService,
              private alertService: AlertService) {
  }

  ngOnInit() {
  }

  removeCluster(id: number) {
    //TODO add id
    this.clusterService.deleteCluster(200).then(value => {
      this.alertService.success(value.message);
    });
  }

  downloadConfig(id: number) {
    this.clusterService.fetchClusterConfig(id).then(value => {
      const blob = new Blob([atob(value.data)], {type: 'application/yaml'});
      saveAs(blob, this.CLUSTER_CONFIG_FILE_NAME)
    })
  }

}
