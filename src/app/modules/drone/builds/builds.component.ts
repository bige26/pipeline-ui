import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RepositoryService} from '../../../services/repository.service';
import {Build} from '../../../models/build';
import {RouterParams} from '../../../models/repository';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-builds',
  templateUrl: './builds.component.html',
  styleUrls: ['./builds.component.css']
})
export class BuildsComponent implements OnInit, OnDestroy {

  public builds: Build[] = [];
  private buildSub: Subscription = null;
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public title: string;
  public repository: RouterParams;
  public page = 1;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private repositoryService: RepositoryService) {
  }

  ngOnInit() {
    this.isLoading.next(true);
    this.route.params.subscribe(params => {
      if (this.buildSub) {
        this.buildSub.unsubscribe();
      }
      this.buildSub = this.repositoryService.getBuilds(params['user'], params['repo']).subscribe(resp => {
        this.isLoading.next(false);
        this.repository = {user: params['user'], repo: params['repo']};
        this.title = params['user'] + '/' + params['repo'];
        this.builds = resp;
      });
    });
  }

  public beckToDashboard() {
    this.router.navigate(['drone/repository']);
  }

  public selectBuild(build: Build) {
    this.repository.build = build.number;
    this.router.navigate(['drone/build', this.repository]);
  }

  ngOnDestroy() {
    this.buildSub.unsubscribe();
  }

}
