import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {ClusterCreateComponent} from './cluster-create/cluster-create.component';
import {ClusterComponent} from './cluster.component';
import {ClusterRoutingModule} from './cluster-routing.module';
import {ClusterListComponent} from './cluster-list/cluster-list.component';
import {ClusterDetailComponent} from './cluster-detail/cluster-detail.component';
import {SecretService} from '../../services/cluster/secret.service';
import {ClusterService} from '../../services/cluster/cluster.service';
import {ProfileService} from '../../services/cluster/profile.service';

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
  ],
  providers: [
    SecretService,
    ClusterService,
    ProfileService
  ]
})
export class ClusterModule {
}
