import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from './services/user.service';
import {User} from './models/user';
import {AuthService} from './services/auth.service';
import {OrganizationService} from './services/organization.service';
import {OrganizationListItemResponse} from './models/organization.model';
import {FormControl, FormGroup} from '@angular/forms';
import {environment} from '../environments/environment';
import {Modal} from 'ngx-modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public userData: User;
  public show = false;

  public devRegistrationForm: FormGroup;

  public currentOrg: string;
  public orgs: Array<OrganizationListItemResponse> = [];

  @ViewChild('devLoginModal') devTokenModal: Modal;

  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private orgService: OrganizationService) {
  }

  ngOnInit() {
    this.show = false;
    this.initDevForm();

    this.authService.getPipelineToken().then(value => {
      this.authService.setToken(value.token);

      this.userService.getUser().then(response => {
        this.userData = response;
      });

      this.orgService.getOrgranizations().then(orgs => {
        this.orgs = orgs;

        const currentOrg = this.orgService.getCurrentOrganization();
        if (currentOrg) {
          this.currentOrg = currentOrg;
        } else {
          // TODO: set default org
        }
      });
    }).catch(reason => {
      // dev mode token registraion
      if (!environment.production && this.authService.isInvalidToken()) {
        this.devTokenModal.open();
      }
    });
  }

  public logout(): void {
    this.authService.clear();
    this.router.navigate(['login']);
  }

  public toggleCollapse() {
    this.show = !this.show;
  }

  public onOrgChange() {
    this.orgService.setCurrentOrganization(this.currentOrg);
  }

  public devReg() {
    this.authService.setToken(this.devRegistrationForm.get('token').value);
    window.location.reload();
    this.devTokenModal.close();
  }

  private initDevForm() {
    this.devRegistrationForm = new FormGroup({
      token: new FormControl('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL3BpcGVsaW5lLmJhbnphaWNsb3VkLmNvbSIsImp0aSI6ImQwNDU5MWYyLWUyNjctNDlmMC05ODBmLTg0MTQ4OWU3MmFkMiIsImlhdCI6MTUyMDA5Mzk0NCwiaXNzIjoiaHR0cHM6Ly9iYW56YWljbG91ZC5jb20vIiwic3ViIjoiMiIsInNjb3BlIjoiYXBpOmludm9rZSIsInR5cGUiOiJ1c2VyIiwidGV4dCI6ImJpZGE5NCJ9.vhnh0HZc1f-n9r-raY6RkZU38AMPxOFN2ox7jg3TuLw')
    });
  }

}
