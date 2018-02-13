import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../services/auth.guard';
import {NgModule} from '@angular/core';
import {ClusterCreateComponent} from './cluster-create/cluster-create.component';
import {ClusterComponent} from './cluster.component';
import {ClusterListComponent} from './cluster-list/cluster-list.component';

const CLUSTER_ROUTES: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {
    path: '', component: ClusterComponent, canActivateChild: [AuthGuard], children: [
      {path: 'create', component: ClusterCreateComponent},
      {path: 'list', component: ClusterListComponent}
    ]
  },
  {path: '**', redirectTo: 'list'}
];

@NgModule({
  imports: [
    RouterModule.forChild(CLUSTER_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class ClusterRoutingModule {
}
