import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';

//Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BuildsComponent } from './components/builds/builds.component';

//Services
import { AuthService } from './services/auth.service';
import { BaseService } from './services/base.service';
import { UserService } from './services/user.service';
import { RepositoryService } from './services/repository.service';
import { AuthGuard } from './services/auth.guard';
import { RepoFilterPipe } from './pipes/repo-filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RepoFilterPipe,
    SettingsComponent,
    BuildsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [
    AuthService,
    BaseService,
    UserService,
    AuthGuard,
    RepositoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
