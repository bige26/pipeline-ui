import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AlertModule} from 'ngx-alerts';
// Components
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {SharedModule} from './shared/shared.module';
import {AccordionModule, ModalModule} from 'ngx-bootstrap';
import {BaseInterceptor} from "./services/interceptors/base-interceptor";
import {AuthService} from "./services/auth.service";
import {ClusterDeleteModalComponent} from "./modules/cluster/cluster-delete-modal/cluster-delete-modal.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClusterDeleteModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    SharedModule.forRoot(),
    AccordionModule.forRoot(),
    AlertModule.forRoot({timeout: 3000}),
  ],
  entryComponents: [
    ClusterDeleteModalComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: BaseInterceptor, multi: true, deps: [AuthService]}
  ]
})
export class AppModule {
}
