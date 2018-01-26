import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RepositoryService } from '../../services/repository.service';
import { Repository } from '../../models/repository';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public repositories: Repository[] = [];
  public searchData: string = '';

  constructor(
    private userService: UserService,
    private router: Router,  
    private repositoryService: RepositoryService    
  ) { }

  ngOnInit() {
    const self = this;

    self.userService.getRepositories().then(response => {
      self.repositories = response;                 
    });

    //ToDo app component
    //self.userService.getLatestFeeds().then(_ => console.log(_));
  }

  public onChangeStatus(repo: Repository) {
    const self = this;
    
    if(repo.active) {
      self.repositoryService.activate(repo.owner, repo.name).then(response => response);
    } else {
      self.repositoryService.deactivate(repo.owner, repo.name).then(response => response);
    }
  }

  public openSettings(repo: Repository) {
    const self = this;

    self.router.navigate(['settings', {user: repo.owner, repo: repo.name}], );
  }

  public openBuilds(repo: Repository) {
    const self = this;

    self.router.navigate(['builds', {user: repo.owner, repo: repo.name}]);
  }

}
