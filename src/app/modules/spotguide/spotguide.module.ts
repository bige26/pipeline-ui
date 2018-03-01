import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {SpotguideRoutingModule} from './spotguide-routing.module'
import {SpotguideComponent} from './spotguide.component'

@NgModule({
  imports: [
    SharedModule,
    SpotguideRoutingModule
  ],
  declarations: [DashboardComponent,SpotguideComponent]
})
export class SpotguideModule { }
