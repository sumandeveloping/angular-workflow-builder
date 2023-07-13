import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-workflow-builder',
  templateUrl: './update-workflow-builder.component.html',
  styleUrls: ['./update-workflow-builder.component.scss'],
})
export class UpdateWorkflowBuilderComponent implements OnInit {
  builderID: string;

  constructor(public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.builderID = this.activatedRoute.snapshot.queryParamMap.get('id');
  }
}
