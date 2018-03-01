import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ClusterService} from '../../../services/cluster.service';
import {ClusterRepresentation} from '../../../models/cluster.model';
import {AlertService} from "ngx-alerts";
import {saveAs} from 'file-saver';
import {BsModalService} from "ngx-bootstrap";
import {ClusterDeleteModalComponent} from "../cluster-delete-modal/cluster-delete-modal.component";
import {Subscription} from "rxjs/Subscription";


@Component({
  selector: 'app-cluster-list',
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.scss']
})
export class ClusterListComponent implements OnInit, OnDestroy {

  private CLUSTER_CONFIG_FILE_NAME = 'config.yaml';

  public clusters: Array<ClusterRepresentation> = [];

  public isLoading: boolean;
  public clusterPageCount: number = 8;
  public page = 1;
  public searchData = '';

  private deleteDialogSub: Subscription;

  constructor(private router: Router,
              private alertService: AlertService,
              private modalService: BsModalService,
              private clusterService: ClusterService) {
  }

  ngOnInit() {
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

  addCluster() {
    this.router.navigate(['cluster/create']);
  }


  removeCluster(event, clusterRepresentation: ClusterRepresentation) {
    event.stopPropagation();
    const deleteDialog = this.modalService.show(ClusterDeleteModalComponent, {class: 'cluster-delete-modal-dialog'});
    let dialogContent = (<ClusterDeleteModalComponent>deleteDialog.content)
    dialogContent.clusterName = clusterRepresentation.name;
    dialogContent.clusterId = clusterRepresentation.id;
  }

  downloadConfig(event, id: number) {
    event.stopPropagation();
    this.clusterService.fetchClusterConfig(id).then(value => {
      const blob = new Blob([atob(value.data)], {type: 'application/yaml'});
      saveAs(blob, this.CLUSTER_CONFIG_FILE_NAME)
    })
  }

  private startLoading() {
    this.isLoading = true;
  }

  private stopLoading() {
    this.isLoading = false;
  }


  ngOnDestroy() {
    if (this.deleteDialogSub) {
      this.deleteDialogSub.unsubscribe();
    }
  }
}
