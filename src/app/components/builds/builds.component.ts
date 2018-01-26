import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../services/repository.service';
import { Build } from '../../models/build';

@Component({
  selector: 'app-builds',
  templateUrl: './builds.component.html',
  styleUrls: ['./builds.component.css']
})
export class BuildsComponent implements OnInit {

  public builds: Build[] = [];

  constructor(
    private route: ActivatedRoute,
    private repositoryService: RepositoryService    
  ) { }

  ngOnInit() {
    const self = this;
    self.route.params.subscribe(params => {
      self.repositoryService.getBuilds(params['user'], params['repo']).then(resp => {
        self.builds = resp;
        console.log(self.builds);
      })
    });
  }

}
