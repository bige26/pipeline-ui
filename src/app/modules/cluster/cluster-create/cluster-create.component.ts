import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ClusterProvider, DEFALT_CLUSTER_PROVIDERS} from '../../../models/cluster.model';

@Component({
  selector: 'app-create-cluster',
  templateUrl: './cluster-create.component.html',
  styleUrls: ['./cluster-create.component.scss']
})
export class ClusterCreateComponent implements OnInit {

  public providers: Array<ClusterProvider> = [];
  public step = 1;
  public steps: Array<{ step: number, label: string, status: string }> = [
    {
      step: 1,
      label: 'Choose provider',
      status: ''
    },
    {
      step: 2,
      label: 'Choose provider config',
      status: ''
    },
    {
      step: 3,
      label: 'Configure provider',
      status: ''
    }
  ];


  constructor(private router: Router) {
  }

  ngOnInit() {
    this.providers = DEFALT_CLUSTER_PROVIDERS;
  }

  selectCluster(id: string) {
    this.nextStep();
    console.log(this.step);
  }

  jumpStep(step: number) {
    if (step >= this.step) {
      return;
    } else {
      this.step = step;
      this.steps.forEach((value, index) => {
        if (index >= this.step - 1) {
          value.status = '';
        }
      });
    }
  }

  nextStep() {
    this.steps[this.step - 1].status = 'done';
    this.step++;
  }

  getCurrentStep(): number {
    return this.step;
  }

}
