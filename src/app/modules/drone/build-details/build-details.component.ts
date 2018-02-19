import {Component, OnDestroy, OnInit, NgZone} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RepositoryService} from '../../../services/repository.service';
import {BuildDetails, BuildLog, Process} from '../../../models/build-details';
import {RouterParams} from '../../../models/repository';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import {ElabsedTimePipe} from '../../../shared/pipes/elabsed-time.pipe';
import {Location} from '@angular/common';
import {AlertService} from 'ngx-alerts';

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
  public logMessage: string = "";
  public isCanceled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private zone: NgZone,
    private router: Router,
    private repositoryService: RepositoryService,
    public elapsed: ElabsedTimePipe,
    private location:Location,
    private alertService: AlertService
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
      this.buildSub = this.getBuildByNumber(params['user'], params['repo'], params['build'], params['pid']);
    });
  }

  private getBuildByNumber(user: string, repo: string, build: number, pid: number) {
    return this.repositoryService.getBuildByNumber(user, repo, build).subscribe(resp => {
      this.isLoading.next(false);
      if(pid === undefined || pid === null) {
        pid = 2;
      } 
      this.repository = {user: user, repo: repo, build: build, pid: pid};
      this.title = user + '/' + repo;
      this.buildDetails = resp;
      
      if (this.buildDetails && this.buildDetails.procs && this.buildDetails.procs.length > 0) {
        if(this.buildDetails.procs[0].error) {
          this.isCanceled = true;
        }
      }    
      
      if (this.buildDetails && this.buildDetails.procs && this.buildDetails.procs.length > 0) {
        if(this.buildDetails.status === 'running') {
          this.streamLogs();          
        } else {
          this.showLogs(pid);                    
        }
      }

    });
  }

  private streamLogs() {
    this.logSub = this.repositoryService.getBuildStreamLogs(this.repository.user, this.repository.repo, this.repository.build, 1).subscribe(resp => {
      console.log(resp);
    });
  }

  public openSettings() {
    this.router.navigate(['drone/settings', {user: this.repository.user, repo: this.repository.repo}]);
  }

  public openBuilds() {
    this.router.navigate(['drone/builds', {user: this.repository.user, repo: this.repository.repo}]);
  }

  public openLog(pid: number) {
    this.repository.pid = pid;  
    const url = this
    .router
    .createUrlTree([this.repository], {relativeTo: this.route})
    .toString();

    this.location.go(url);
    this.showLogs(pid);
  }

  public showLogs(pid: number) {
   
    this.repositoryService.getBuildLogs(this.repository.user, this.repository.repo, this.buildDetails.number, pid).then(
      logs => {
        this.logs = logs;
        this.logMessage = "";
        this.logMessage = this.logs.map(log => log.out).join("");
      },
      error => {
        this.logs = [];
      });
  }

  public openRepositories() {
    this.router.navigate(['drone/repositroy']);
  }

  public restart() {
    this.repositoryService.restartBuild(this.repository.user, this.repository.repo, this.buildDetails.number).then(_ => {
      this.alertService.success('Successfully restarted your build!');      
    });
  }

  public cancel() {
    this.repositoryService.cancelBuild(this.repository.user, this.repository.repo, this.buildDetails.number, 1).then(_ => {
      this.alertService.success('Successfully canceled your build!');      
    });    
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
