import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../services/auth.guard';
import {NgModule} from '@angular/core';
import {SpotguideComponent} from './spotguide.component';
import {DashboardComponent} from './dashboard/dashboard.component';

const SPOTGUIDE_ROUTES: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: '', component: SpotguideComponent, canActivateChild: [AuthGuard], children: [
      {path: 'dashboard', component: DashboardComponent}      
    ]
  },
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [
    RouterModule.forChild(SPOTGUIDE_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class SpotguideRoutingModule {
}
