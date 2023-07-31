import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleBlockComponent } from './components/single-block/single-block.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularDraggableModule } from 'angular2-draggable';
import { ModalComponent } from './components/modal/modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicErrorComponent } from './components/dynamic-form/dynamic-error/dynamic-error.component';
import { DynamicFieldComponent } from './components/dynamic-field/dynamic-field.component';
import { DynamicSelectComponent } from './components/dynamic-field/dynamic-select/dynamic-select.component';
import { DynamicRadioComponent } from './components/dynamic-field/dynamic-radio/dynamic-radio.component';
import { DynamicInputComponent } from './components/dynamic-field/dynamic-input/dynamic-input.component';
import { DynamicCheckboxsComponent } from './components/dynamic-field/dynamic-checkboxs/dynamic-checkboxs.component';

@NgModule({
  declarations: [
    SingleBlockComponent,
    ModalComponent,
    DynamicFormComponent,
    DynamicErrorComponent,
    DynamicFieldComponent,
    DynamicSelectComponent,
    DynamicRadioComponent,
    DynamicInputComponent,
    DynamicCheckboxsComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    AngularDraggableModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
  ],
  exports: [SingleBlockComponent, ModalComponent, DynamicFormComponent],
})
export class SharedModule {}
