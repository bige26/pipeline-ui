import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cluster-list',
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.scss']
})
export class ClusterListComponent implements OnInit {

  public clusters: Array<any> = [];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  addCluster() {
    this.router.navigate(['cluster/create']);
  }

}
