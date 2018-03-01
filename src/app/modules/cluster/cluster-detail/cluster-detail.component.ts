import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {ClusterEndpoint, ClusterRepresentation} from "../../../models/cluster.model";
import {ClusterService} from "../../../services/cluster.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-cluster-detail',
  templateUrl: './cluster-detail.component.html',
  styleUrls: ['./cluster-detail.component.scss']
})
export class ClusterDetailComponent implements OnInit, OnDestroy {

  @Input() cluster: ClusterRepresentation;
  @Input() visibleChange: EventEmitter<boolean>;

  public endpoints: ClusterEndpoint[] = [];

  private visibleChangeSub: Subscription;

  constructor(private clusterService: ClusterService) {
  }

  ngOnInit() {
    this.visibleChange.subscribe(visible => {
      if (visible) {
        this.clusterService.getPublicEndpoints(this.cluster.id).then(value => this.endpoints = value.endpoints);
      }
    });
  }

  ngOnDestroy() {
    if (this.visibleChangeSub) {
      this.visibleChangeSub.unsubscribe();
    }
  }

}
