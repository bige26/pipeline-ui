import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public currentRoute: string = null;
  public userData: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const self = this;
    self.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        self.currentRoute = event.url;
        if (event.url !== '/login') {
          self.userService.getUser().then(response => {
            self.userData = response;
          });
        }
      }
    });
  }

  public logout(): void {
    const self = this;
    self.authService.clear();
    self.router.navigate(['login']);
  }

}
