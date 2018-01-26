import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute    
  ) { }

  ngOnInit() {
    this.route.params.subscribe(_ => console.log(_));
    
  }

}
