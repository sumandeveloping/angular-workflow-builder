import { Component, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { filter, takeWhile } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss'],
})
export class DynamicInputComponent {
  @Input() field: any;
  formName: FormGroup;
  alive = true;

  constructor(
    private messageService: MessageService,
    private formgroupDirective: FormGroupDirective
  ) {
    this.formName = formgroupDirective.control;
  }

  ngAfterViewInit(): void {
    this.listenForLinkData();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  listenForLinkData = () => {
    if (!this.field?.link) {
      return;
    }
    this.conditionTrue();
    this.conditionFalse();
  };

  conditionTrue = () => {
    this.messageService.message$
      .pipe(
        filter(
          (v) => v.link === this.field.link && v.value === this.field.linkValue
        ),
        takeWhile(() => this.alive)
      )
      .subscribe({
        next: (v) => {
          this.field.hidden = false;
          if (this.field.requiredWhenDisplayed) {
            this.formName
              .get(`${this.field.fieldName}`)
              .addValidators(Validators.required);
            this.formName
              .get(`${this.field.fieldName}`)
              .updateValueAndValidity();
          }
        },
        error: (e) => {},
        complete: () => {},
      });
  };

  conditionFalse = () => {
    this.messageService.message$
      .pipe(
        filter(
          (v) => v.link === this.field.link && v.value != this.field.linkValue
        ),
        takeWhile(() => this.alive)
      )
      .subscribe({
        next: (v) => {
          this.field.hidden = true;
          if (
            this.formName.get(`${this.field.fieldName}`).errors != null &&
            this.formName.get(`${this.field.fieldName}`).errors['required'] ===
              true
          ) {
            this.formName
              .get(`${this.field.fieldName}`)
              .removeValidators(Validators.required);
            this.formName
              .get(`${this.field.fieldName}`)
              .updateValueAndValidity();
          }
        },
        error: (e) => {},
        complete: () => {},
      });
  };
}
