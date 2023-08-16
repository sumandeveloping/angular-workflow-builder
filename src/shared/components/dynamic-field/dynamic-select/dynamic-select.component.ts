import { AfterViewInit, Component, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { filter, takeWhile } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

declare var bootstrap: any;
@Component({
  selector: 'app-dynamic-select',
  templateUrl: './dynamic-select.component.html',
  styleUrls: ['./dynamic-select.component.scss'],
})
export class DynamicSelectComponent implements AfterViewInit {
  @Input() field: any;
  formName: FormGroup;
  alive = true;

  constructor(
    private messageService: MessageService,
    private formGroupDirective: FormGroupDirective
  ) {
    this.formName = formGroupDirective.control;
  }

  ngAfterViewInit(): void {
    this.listenForLinkData();
    const tooltipTriggerEl = document.querySelector(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltip = new bootstrap.Tooltip(tooltipTriggerEl);
    // tooltip.show();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  listenForLinkData = () => {
    if (!this.field?.link) {
      return;
    }
    // this.messageService.message$
    //   .pipe(
    //     filter((v) => v.link === this.field.link),
    //     takeWhile(() => this.alive)
    //   )
    //   .subscribe((v) => {
    //     this.field.options = v.data;
    //   });
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

  changedValue = (value: string) => {
    if (!this.field.linkedFields) {
      return;
    }
    this.messageService.messageSubject.next({
      link: this.field.fieldName,
      value: value,
      //   data: this.field.provideData.filter((v) => v.sourceValue === value),
    });
  };
}
