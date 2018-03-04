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
    //this.authService.setToken(this.registrationForm.get('token').value);
    this.authService.getPipelineToken().then(resp => {
      this.authService.setToken(resp.token);
    }).catch(_ => {
      this.authService.setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL3BpcGVsaW5lLmJhbnphaWNsb3VkLmNvbSIsImp0aSI6ImQwNDU5MWYyLWUyNjctNDlmMC05ODBmLTg0MTQ4OWU3MmFkMiIsImlhdCI6MTUyMDA5Mzk0NCwiaXNzIjoiaHR0cHM6Ly9iYW56YWljbG91ZC5jb20vIiwic3ViIjoiMiIsInNjb3BlIjoiYXBpOmludm9rZSIsInR5cGUiOiJ1c2VyIiwidGV4dCI6ImJpZGE5NCJ9.vhnh0HZc1f-n9r-raY6RkZU38AMPxOFN2ox7jg3TuLw");      
    });
    this.router.navigate(['drone']);    
  }

  ngOnInit() {
    this.registration();
  }

}
