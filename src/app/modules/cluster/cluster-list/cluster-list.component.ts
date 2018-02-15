import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ClusterService} from '../../../services/cluster.service';
import {ClusterRepresentation} from '../../../models/cluster.model';

@Component({
  selector: 'app-cluster-list',
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.scss']
})
export class ClusterListComponent implements OnInit {

  public clusters: Array<ClusterRepresentation> = [];

  constructor(private router: Router, private clusterService: ClusterService) {
  }

  ngOnInit() {
    this.clusterService.getClusters().then(value => this.clusters = value.data);
  }

  addCluster() {
    this.router.navigate(['cluster/create']);
  }

}
