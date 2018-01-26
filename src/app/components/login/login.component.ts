import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService    
  ){}

  public registrationForm: FormGroup = new FormGroup({
    token: new FormControl('')
  });

  public registration(): void {
    const self = this;
    self.authService.setToken(self.registrationForm.get("token").value);
    self.router.navigate(['dashboard']);
  }

  ngOnInit() {
  }

}
