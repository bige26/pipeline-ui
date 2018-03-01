import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('flipState', [
      state('active', style({
        transform: 'rotateY(179.9deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ])  
  ]
})
export class DashboardComponent implements OnInit {

  public flipSpark: string = 'inactive';  
  public flipZeppelin: string = 'inactive';  
  
  constructor() { }

  ngOnInit() {
  }

  toggleFlipSpark() {
    this.flipSpark = (this.flipSpark === 'inactive') ? 'active' : 'inactive';
  }

  toggleFlipZeppelin() {
    this.flipZeppelin = (this.flipZeppelin === 'inactive') ? 'active' : 'inactive';
  }

}
