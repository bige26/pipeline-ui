import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from '../../../services/repository.service';
import { BuildDetails, BuildLog, Process } from '../../../models/build-details';
import { RouterParams } from '../../../models/repository';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { ElabsedTimePipe } from '../../../shared/pipes/elabsed-time.pipe';
import { Location } from '@angular/common';
import { AlertService } from 'ngx-alerts';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { DOCUMENT} from '@angular/common';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-build-details',
  templateUrl: './build-details.component.html',
  styleUrls: ['./build-details.component.scss']
})
export class BuildDetailsComponent implements OnInit, OnDestroy {

  private buildSub: Subscription = null;
  private logSub: Subscription = null;
  private routeSub: Subscription = null;
  private playLogSub: Subscription = null;
  private streamData: BuildLog[] = [];
  private selectedProcess: string = '';
  private logTimer = Observable.timer(0, 1000);

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isLoadingLogs: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public title = '';
  public routerParams: RouterParams;
  public buildDetails: BuildDetails;
  public logs: BuildLog[] = [];
  public logMessage: string = "";
  public isCanceled: boolean = false;
  public isPlayingLogs: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private repositoryService: RepositoryService,
    public elapsed: ElabsedTimePipe,
    private location: Location,
    private pageScrollService: PageScrollService,
    private alertService: AlertService,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit() {
    this.isLoading.next(true);
    this.routeSub = this.route.params.subscribe(params => {
      if (this.buildSub) {
        this.buildSub.unsubscribe();
      }
      if (this.logSub) {
        this.logSub.unsubscribe();
      }
      this.routerParams = { 
        user: params['user'], 
        repo: params['repo'], 
        build: params['build'], 
        pid: params['pid'] 
      };      
      this.buildSub = this.getBuildByNumber(params['user'], params['repo'], params['build'], params['pid']);
    });
  }

  private getBuildByNumber(user: string, repo: string, build: number, pid: number) {
    return this.repositoryService.getBuildByNumber(user, repo, build).subscribe(resp => {
      this.title = user + '/' + repo;
      this.buildDetails = resp;
      this.isLoading.next(false);
      
      if (this.buildDetails && this.buildDetails.procs && this.buildDetails.procs.length > 0) {
        if (this.buildDetails.procs[0].error) {
          this.isCanceled = true;
        }
        
        if (this.buildDetails.status === 'running') {
          if(!this.selectedProcess) {
            this.selectedProcess = this.buildDetails.procs[0].children[0].name; 
            this.streamLogs();            
          }
        } else {
          if (this.buildSub) {
            this.buildSub.unsubscribe();
          }
          this.isLoadingLogs.next(true); 
          this.showLogs(pid);
        }
      }

    });
  }

  private streamLogs() {
    if (this.logSub) {
      this.logSub.unsubscribe();
    }
    this.logSub = this.repositoryService.getBuildStreamLogs(this.routerParams.user, this.routerParams.repo, this.routerParams.build, 1).subscribe(resp => {
      setTimeout(() => {
        this.streamData.push(resp);
        this.logs = this.streamData.filter(log => log.proc === this.selectedProcess);        
      }, 0);
    });
  }

  public openSettings() {
    this.router.navigate(['drone/settings', { user: this.routerParams.user, repo: this.routerParams.repo }]);
  }

  public openBuilds() {
    this.router.navigate(['drone/builds', { user: this.routerParams.user, repo: this.routerParams.repo }]);
  }

  public openLog(proc: Process) {
    this.routerParams.pid = proc.pid;
    const url = this
      .router
      .createUrlTree([this.routerParams], { relativeTo: this.route })
      .toString();

    if (this.buildSub) {
      this.buildSub.unsubscribe();
      this.buildSub = this.getBuildByNumber(this.routerParams.user, this.routerParams.repo, this.routerParams.build, this.routerParams.pid);
    }

    this.location.go(url);
    if (this.buildDetails.status === 'running') {
      this.selectedProcess = proc.name;
      this.logs = this.streamData.filter(log => log.proc === this.selectedProcess);
      this.logMessage = this.logs.map(log => log.out).join("");      
    } else {
      this.showLogs(proc.pid);
    }
  }

  public showLogs(pid: number) {
    this.repositoryService.getBuildLogs(this.routerParams.user, this.routerParams.repo, this.buildDetails.number, pid).then(
      logs => {
        this.logs = logs;
        this.logMessage = this.logs.map(log => log.out).join("");
        this.isLoadingLogs.next(false);            
      },
      error => {
        this.logs = [];
      });
  }

  public openRepositories() {
    this.router.navigate(['drone/repositroy']);
  }

  public restart() {
    this.repositoryService.restartBuild(this.routerParams.user, this.routerParams.repo, this.buildDetails.number).then(_ => {
      this.alertService.success('Successfully restarted your build!');
    });
  }

  public cancel() {
    this.repositoryService.cancelBuild(this.routerParams.user, this.routerParams.repo, this.buildDetails.number, 1).then(_ => {
      this.alertService.success('Successfully canceled your build!');
    });
  }

  public copyToClipboard() {
    this.alertService.success('Copy to clipboard!');    
  }

  public playLogs() {
    this.isPlayingLogs = true;
    this.playLogSub = this.logTimer.map(_ => {
      let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#down');
      this.pageScrollService.start(pageScrollInstance);
    }).subscribe();

  }

  public stopLogs() {
    this.isPlayingLogs = false;
    if(this.playLogs) {
      this.playLogSub.unsubscribe();
    }
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
