import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {ClusterCreateComponent} from './cluster-create/cluster-create.component';
import {ClusterComponent} from './cluster.component';
import {ClusterRoutingModule} from './cluster-routing.module';
import {ClusterListComponent} from './cluster-list/cluster-list.component';
import {ClusterDetailComponent} from './cluster-detail/cluster-detail.component';

@NgModule({
  imports: [
    SharedModule,
    ClusterRoutingModule
  ],
  declarations: [
    ClusterComponent,
    ClusterCreateComponent,
    ClusterListComponent,
    ClusterDetailComponent
  ]
})
export class ClusterModule {
}
