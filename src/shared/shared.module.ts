import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleBlockComponent } from './components/single-block/single-block.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularDraggableModule } from 'angular2-draggable';
import { ModalComponent } from './components/modal/modal.component';
import { DecisionComponent } from './components/decision/decision.component';
import { ActionComponent } from './components/action/action.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SegmentComponent } from './components/segment/segment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmailComponent } from './components/email/email.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

@NgModule({
  declarations: [
    SingleBlockComponent,
    ModalComponent,
    DecisionComponent,
    ActionComponent,
    SegmentComponent,
    EmailComponent,
    ContactFormComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    AngularDraggableModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
  ],
  exports: [
    SingleBlockComponent,
    ModalComponent,
    DecisionComponent,
    ActionComponent,
    SegmentComponent,
    ContactFormComponent,
    EmailComponent,
  ],
})
export class SharedModule {}
