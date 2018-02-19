import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {RepositoryService} from '../../../services/repository.service';
import {Repository, RouterParams} from '../../../models/repository';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {

  public repositories: Repository[] = [];
  public searchData = '';
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private userService: UserService,
              private router: Router,
              private repositoryService: RepositoryService) {
  }

  ngOnInit() {
    this.getRepositories();
  }

  public getRepositories() {
    this.isLoading.next(true);
    this.userService.getRepositories().then(response => {
      this.repositories = response;
      this.isLoading.next(false);
    });
  }

  public onChangeStatus(repo: Repository) {

    if (repo.active) {
      this.repositoryService.activate(repo.owner, repo.name).then(response => response);
    } else {
      this.repositoryService.deactivate(repo.owner, repo.name).then(response => response);
    }
  }

  public openSettings(repo: Repository) {

    this.router.navigate(['drone/settings', this.createRouterParams(repo)]);
  }

  public openBuilds(repo: Repository) {

    this.router.navigate(['drone/builds', this.createRouterParams(repo)]);
  }

  private createRouterParams(repo: Repository): RouterParams {

    const params: RouterParams = {
      user: repo.owner,
      repo: repo.name
    };

    return params;
  }

}
