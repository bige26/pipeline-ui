import {Injectable, NgZone} from '@angular/core';
import {BaseService} from './base.service';
import {Repository} from '../models/repository';
import {Build} from '../models/build';
import {BuildDetails, BuildLog} from '../models/build-details';
import {Secret} from '../models/secret';
import {Registry} from '../models/registry';
import {Observable} from 'rxjs';

@Injectable()
export class RepositoryService {

  private basePath: string = '/api/repos/';
  private buildTimer = Observable.timer(0, 100000);
  private buildDetailsTimer = Observable.timer(0,300000);
  private buildLogsTimer = Observable.timer(0,1000000);
  private eventSource: any = window['EventSource'];  
  
  constructor(
    private baseService: BaseService,
    private zone: NgZone
  ) {
  }

  public activate(owner: string, name: string): Promise<Repository> {
    return this.baseService.post<Repository>(this.buildBasePath(owner, name));
  }

  public deactivate(owner: string, name: string): Promise<Repository> {
    return this.baseService.delete<Repository>(this.buildBasePath(owner, name));
  }

  public getBuilds(owner: string, name: string): Observable<Build[]> {
    return this.buildTimer.flatMap(_ => this.baseService.get<Build[]>(this.buildBasePath(owner, name) + '/' + 'builds'));
  }

  public getBuildByNumber(owner: string, name: string, buildNumber: number): Observable<BuildDetails> {
    return this.buildDetailsTimer.flatMap(_ => this.baseService.get<BuildDetails>(this.buildBasePath(owner, name) + '/' + 'builds/' + buildNumber));
  }

  public restartBuild(owner: string, name: string, buildNumber: number): Promise<BuildDetails> {
    return this.baseService.post<BuildDetails>(this.buildBasePath(owner, name) + '/' + 'builds/' + buildNumber);
  }

  public cancelBuild(owner: string, name: string, buildNumber: number, job: number): Promise<void> {
    return this.baseService.delete<void>(this.buildBasePath(owner, name) + '/' + 'builds/' + buildNumber + '/' + job);
  }

  public getBuildLogs(owner: string, name: string, buildNumber: number, processId: number): Promise<BuildLog[]> {
    return this.baseService.get<BuildLog[]>(this.buildBasePath(owner, name) + '/' + 'logs/' + buildNumber + '/' + processId);
  }

  public getBuildStreamLogs(owner: string, name: string, buildNumber: number, processId: number): Observable<any> {
    return Observable.create(observer => {
      const eventSource = new this.eventSource(this.buildBasePath(owner, name, '/stream/logs/') + '/' + buildNumber + '/' + processId);
      eventSource.onmessage = logs => this.zone.run(() => observer.next(JSON.parse(logs.data)));
      eventSource.onerror = error => this.zone.run(() => observer.error(error));
      return () => eventSource.close();
    });
    
  }

  public getRepositoy(owner: string, name: string): Promise<Repository> {
    return this.baseService.get<Repository>(this.buildBasePath(owner, name));
  }

  public saveSettings(owner: string, name: string, repo: Object): Promise<Repository> {
    return this.baseService.patch<Repository>(this.buildBasePath(owner, name), repo);
  }

  public saveSecret(owner: string, name: string, secret: Secret): Promise<Secret> {
    return this.baseService.post<Secret>(this.buildBasePath(owner, name) + '/secrets', secret);
  }

  public getSecrets(owner: string, name: string): Promise<Secret[]> {
    return this.baseService.get<Secret[]>(this.buildBasePath(owner, name) + '/secrets');
  }

  public deleteSecret(owner: string, name: string, secretName: string): Promise<void> {
    return this.baseService.delete<void>(this.buildBasePath(owner, name) + '/secrets/' + secretName);
  }

  public saveRegistry(owner: string, name: string, registry: Registry): Promise<Registry> {
    return this.baseService.post<Registry>(this.buildBasePath(owner, name) + '/registry', registry);
  }

  public getRegistries(owner: string, name: string): Promise<Registry[]> {
    return this.baseService.get<Registry[]>(this.buildBasePath(owner, name) + '/registry');
  }

  public deleteRegistry(owner: string, name: string, registryName: string): Promise<void> {
    return this.baseService.delete<void>(this.buildBasePath(owner, name) + '/registry/' + registryName);
  }

  private buildBasePath(owner: string, name: string, otherPath?: string): string {
    if(otherPath) {
      return otherPath + owner + '/' + name;      
    } else {
      return this.basePath + owner + '/' + name;      
    }
  }

}
