import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatIconModule} from '@angular/material';
import {ElabsedTimePipe} from './pipes/elabsed-time.pipe';
import {MaskPipe} from './pipes/mask.pipe';
import {AlertModule} from 'ngx-alerts';
import {AccordionModule} from 'ngx-bootstrap';
import {AuthService} from '../services/auth.service';
import {BaseService} from '../services/base.service';
import {AuthGuard} from '../services/auth.guard';
import {UserService} from '../services/user.service';
import {DurationTimePipe} from './pipes/duration-time.pipe';
import {DeploymentService} from '../services/deployment.service';
import {StatusService} from '../services/status.service';
import {FilterPipe} from './pipes/filter.pipe';
import {ModalModule} from 'ngx-modal';
import {OrganizationService} from '../services/organization.service';

@NgModule({
  declarations: [
    FilterPipe,
    MaskPipe,
    ElabsedTimePipe,
    DurationTimePipe
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    MatIconModule,
    AccordionModule,
    AlertModule,
    FilterPipe,
    MaskPipe,
    ElabsedTimePipe,
    DurationTimePipe,
    ModalModule
  ]
})
export class SharedModule {

  // Use only in app-component
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AuthGuard,
        AuthService,
        BaseService,
        UserService,
        StatusService,
        DeploymentService,
        OrganizationService
      ]
    };
  }
}
