import {RouterModule, Routes} from '@angular/router';
import {RepositoryComponent} from './repository/repository.component';
import {DroneComponent} from './drone.component';
import {SettingsComponent} from './settings/settings.component';
import {BuildsComponent} from './builds/builds.component';
import {BuildDetailsComponent} from './build-details/build-details.component';
import {AuthGuard} from '../../services/auth.guard';
import {NgModule} from '@angular/core';

const DRONE_ROUTES: Routes = [
  {path: '', redirectTo: 'repository', pathMatch: 'full'},
  {
    path: '', component: DroneComponent, canActivateChild: [AuthGuard], children: [
      {path: 'repository', component: RepositoryComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'builds', component: BuildsComponent},
      {path: 'build', component: BuildDetailsComponent}
    ]
  },
  {path: '**', redirectTo: 'repository'}
];

@NgModule({
  imports: [
    RouterModule.forChild(DRONE_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class DroneRoutingModule {
}
