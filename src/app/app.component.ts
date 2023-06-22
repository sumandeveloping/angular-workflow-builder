import { Component, ElementRef, ViewChild } from '@angular/core';

declare var LeaderLine: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-workflow-builder';
  constructor() {}

  ngAfterViewInit(): void {}
}
