import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './services/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: 'drone', pathMatch: 'full'},
  {path: 'drone', loadChildren: 'app/modules/drone/drone.module#DroneModule', canActivate: [AuthGuard]},
  {path: 'cluster', loadChildren: 'app/modules/cluster/cluster.module#ClusterModule', canActivate: [AuthGuard]},
  {path: 'spotguide', loadChildren: 'app/modules/spotguide/spotguide.module#SpotguideModule', canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'drone'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
