import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  public registrationForm: FormGroup = new FormGroup({
    token: new FormControl('')
  });

  public registration(): void {
    this.authService.setToken(this.registrationForm.get('token').value);
    this.router.navigate(['drone']);
  }

  ngOnInit() {
  }

}
