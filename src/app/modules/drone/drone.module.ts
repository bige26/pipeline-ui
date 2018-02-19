import {NgModule} from '@angular/core';
import {RepositoryComponent} from './repository/repository.component';
import {SharedModule} from '../../shared/shared.module';
import {FeedComponent} from './feed/feed.component';
import {BuildDetailsComponent} from './build-details/build-details.component';
import {BuildsComponent} from './builds/builds.component';
import {DroneComponent} from './drone.component';
import {SettingsComponent} from './settings/settings.component';
import {RepositoryService} from '../../services/repository.service';
import {DroneRoutingModule} from './drone-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ElabsedTimePipe } from '../../shared/pipes/elabsed-time.pipe';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  imports: [
    SharedModule,
    DroneRoutingModule,
    BsDropdownModule.forRoot(),
    ClipboardModule
  ],
  declarations: [
    FeedComponent,
    BuildDetailsComponent,
    BuildsComponent,
    RepositoryComponent,
    SettingsComponent,
    DroneComponent
  ],
  providers: [
    RepositoryService,
    ElabsedTimePipe
  ]
})
export class DroneModule {
}
