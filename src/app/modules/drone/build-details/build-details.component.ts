import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RepositoryService} from '../../../services/repository.service';
import {BuildDetails, BuildLog, Process} from '../../../models/build-details';
import {RouterParams} from '../../../models/repository';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import { ElabsedTimePipe } from '../../../shared/pipes/elabsed-time.pipe';

@Component({
  selector: 'app-build-details',
  templateUrl: './build-details.component.html',
  styleUrls: ['./build-details.component.scss']
})
export class BuildDetailsComponent implements OnInit, OnDestroy {

  private buildSub: Subscription = null;
  private logSub: Subscription = null;
  private routeSub: Subscription = null;  
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public title = '';
  public repository: RouterParams;
  public buildDetails: BuildDetails;
  public logs: BuildLog[] = [];
  public isCanceled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private repositoryService: RepositoryService,
    public elapsed: ElabsedTimePipe
  ) { }

  ngOnInit() {
    this.isLoading.next(true);
    this.routeSub = this.route.params.subscribe(params => {
      if(this.buildSub) {
        this.buildSub.unsubscribe();
      }
      if(this.logSub){
        this.logSub.unsubscribe();
      }
      this.buildSub = this.getBuildByNumber(params['user'], params['repo'], params['build']);
    });
  }

  private getBuildByNumber(user: string, repo: string, build: string) {
    return this.repositoryService.getBuildByNumber(user, repo, build).subscribe(resp => {
      this.isLoading.next(false);
      this.repository = {user: user, repo: repo, build: parseInt(build)};
      this.title = user + '/' + repo;
      this.buildDetails = resp;
      
      if (this.buildDetails && this.buildDetails.procs && this.buildDetails.procs.length > 0) {
        if(this.buildDetails.procs[0].error) {
          this.isCanceled = true;
        }
      }
      /*
      if (this.buildDetails && this.buildDetails.procs && this.buildDetails.procs.length > 0) {
        this.showLogs(this.buildDetails.procs[0].children[0]);
      }*/

    });
  }

  public openSettings() {
    this.repository.build = undefined;
    this.router.navigate(['drone/settings', this.repository]);
  }

  public openBuilds() {
    this.repository.build = undefined;
    this.router.navigate(['drone/builds', this.repository]);
  }

  public showLogs(process: Process) {
    if(this.logSub){
      this.logSub.unsubscribe();
    }
    this.logSub = this.repositoryService.getBuildLogs(this.repository.user, this.repository.repo, this.buildDetails.number, process.pid).subscribe(
      logs => {
        this.logs = logs;
        const exitCode: BuildLog = {
          out: 'exit code ' + process.exit_code,
          pos: undefined,
          time: undefined,
          proc: process.name
        }
        this.logs.push(exitCode);
      },
      error => {
        this.logs = [];
      });
  }

  public openRepositories() {
    this.router.navigate(['drone/repositroy']);
  }

  public restart() {
    this.repositoryService.restartBuild(this.repository.user, this.repository.repo, this.buildDetails.number);
  }

  public cancel() {
    this.repositoryService.cancelBuild(this.repository.user, this.repository.repo, this.buildDetails.number, 1);    
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.buildSub) {
      this.buildSub.unsubscribe();
    }
    if (this.logSub) {
      this.logSub.unsubscribe();
    }
  }

}
