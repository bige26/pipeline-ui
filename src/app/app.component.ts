import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {UserService} from './services/user.service';
import {User} from './models/user';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public currentRoute: string = null;
  public userData: User;
  private show = false;

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.show = false;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        if (event.url !== '/login' && this.authService.getToken() !== null) {
          this.userService.getUser().then(response => {
            this.userData = response;
          });
        }
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

}
