import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-dynamic-error',
  templateUrl: './dynamic-error.component.html',
  styleUrls: ['./dynamic-error.component.scss'],
})
export class DynamicErrorComponent implements OnInit {
  formName: FormGroup;
  @Input() fieldName: string;
  @Input() label: string;

  constructor(private formgroupDirective: FormGroupDirective) {}

  ngOnInit() {
    this.formName = this.formgroupDirective.control;
  }
}
