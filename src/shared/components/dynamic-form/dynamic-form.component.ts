import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
  @Input() model: {};
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  //   model = {
  //     sources: {
  //       id: 'sources',
  //       label: 'Sources',
  //       type: 'select',
  //       hidden: false,
  //       rules: {
  //         required: true,
  //       },
  //       options: [
  //         {
  //           label: 'Campaign List',
  //           value: 'CL',
  //         },
  //         {
  //           label: 'Segment List',
  //           value: 'SL',
  //         },
  //       ],
  //       provideData: [
  //         {
  //           label: 'Campaign List 1',
  //           sourceValue: 'CL',
  //           value: 'Campaign List 1',
  //         },
  //         {
  //           label: 'Campaign List 2',
  //           sourceValue: 'CL',
  //           value: 'Campaign List 2',
  //         },
  //         {
  //           label: 'Segment List 1',
  //           sourceValue: 'SL',
  //           value: 'Segment List 1',
  //         },
  //         {
  //           label: 'Segment List 2',
  //           sourceValue: 'SL',
  //           value: 'Segment List 2',
  //         },
  //       ],
  //     },
  //     segmentList: {
  //       label: 'Segment list',
  //       type: 'select',
  //       link: 'sources',
  //       value: '',
  //       hidden: false,
  //       options: [
  //         {
  //           label: 'Select Sources First',
  //           value: '',
  //         },
  //       ],
  //     },
  //     textInout: {
  //       label: 'Segment list',
  //       type: 'text',
  //       link: 'sources',
  //       linkValue: 'SL',
  //       value: '',
  //       hidden: true,
  //     },
  //   };
  public dynamicFormGroup: FormGroup;
  public fields = [];

  ngOnInit() {
    this.buildForm();
  }

  buildForm = () => {
    const formGroupFields = this.getFormControlsFields();
    this.dynamicFormGroup = new FormGroup(formGroupFields);
  };

  getFormControlsFields = () => {
    const formGroupFields = {};
    for (const field of Object.keys(this.model)) {
      const fieldProps = this.model[field];
      const validators = this.addValidator(fieldProps.rules);

      formGroupFields[field] = new FormControl(fieldProps.value, validators);
      this.fields.push({ ...fieldProps, fieldName: field });
    }

    return formGroupFields;
  };

  addValidator = (rules) => {
    if (!rules) {
      return [];
    }
    const validators = Object.entries(rules).map((rule: any) => {
      switch (rule[0]) {
        case 'required':
          return Validators.required;
        case 'maxLength':
          return Validators.maxLength(rule[1]);
        case 'pattern':
          return Validators.pattern(rule[1]);
        case 'email':
          return Validators.email;
        default:
          break;
        //add more case for future.
      }
    });
    return validators.filter((item) => item);
  };

  onAdd = () => {
    this.add.emit(this.dynamicFormGroup.value);
  };

  onCancel = () => {
    this.cancel.emit();
  };
}
