import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ClusterService} from '../../../services/cluster.service';
import {ClusterRepresentation} from '../../../models/cluster.model';
import {AlertService} from "ngx-alerts";

@Component({
  selector: 'app-cluster-list',
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.scss']
})
export class ClusterListComponent implements OnInit {

  public clusters: Array<ClusterRepresentation> = [];

  public isLoading: boolean;
  public clusterPageCount: number = 8;
  public page = 1;
  public searchData = '';

  constructor(private router: Router,
              private alertService: AlertService,
              private clusterService: ClusterService) {
  }

  ngOnInit() {
    this.startLoading();
    this.clusterService.getClusters().then(value => {
      value.data.push({
        id: 1,
        name: 'amazon',
        amazon: {
          ip: '213'
        },
        azure: null,
        cloud: 'amazon'
      });
      this.clusters = value.data;
      this.stopLoading();
    });
  }

  addCluster() {
    this.router.navigate(['cluster/create']);
  }

  private startLoading() {
    this.isLoading = true;
  }

  private stopLoading() {
    this.isLoading = false;
  }
}
