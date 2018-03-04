import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ClusterService} from '../../../services/cluster.service';
import {ClusterRepresentation} from '../../../models/cluster.model';
import {AlertService} from 'ngx-alerts';
import {saveAs} from 'file-saver';
import {Subscription} from 'rxjs/Subscription';
import {Modal} from 'ngx-modal';


@Component({
  selector: 'app-cluster-list',
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.scss']
})
export class ClusterListComponent implements OnInit, OnDestroy {

  private CLUSTER_CONFIG_FILE_NAME = 'config.yaml';

  public clusters: Array<ClusterRepresentation> = [];

  public isLoading: boolean;
  public clusterPageCount = 8;
  public page = 1;
  public searchData = '';

  public selectedClusterId: number;
  public selectedClusterName = '';
  public deletedClusterName = '';

  private deleteDialogSub: Subscription;

  constructor(private router: Router,
              private alertService: AlertService,
              private clusterService: ClusterService) {
  }

  ngOnInit() {
    this.refreshClusters();
  }

  addCluster() {
    this.router.navigate(['cluster/create']);
  }

  openDeleteModal(event, selected: ClusterRepresentation, deleteModal: Modal) {
    event.stopPropagation();
    this.selectedClusterId = selected.id;
    this.selectedClusterName = selected.name;
    deleteModal.open();
  }

  deleteCluster() {
    this.clusterService.deleteCluster(this.selectedClusterId).then(value => {
      this.alertService.success(value.message);
      this.refreshClusters();
    }).catch(reason => this.alertService.danger('Cluster delete error!'));
    this.deletedClusterName = '';
  }

  downloadConfig(event, id: number) {
    event.stopPropagation();
    this.clusterService.fetchClusterConfig(id).then(value => {
      const blob = new Blob([atob(value.data)], {type: 'application/yaml'});
      saveAs(blob, this.CLUSTER_CONFIG_FILE_NAME);
    });
  }


  ngOnDestroy() {
    if (this.deleteDialogSub) {
      this.deleteDialogSub.unsubscribe();
    }
  }

  private refreshClusters() {
    this.startLoading();
    this.clusterService.getClusters().then(value => {
      if (value.data) {
        this.clusters = value.data;
      }
      this.stopLoading();
    }).catch(reason => {
      this.stopLoading();
    });
  }

  private startLoading() {
    this.isLoading = true;
  }

  private stopLoading() {
    this.isLoading = false;
  }
}
