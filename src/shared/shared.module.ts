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
import { UpdateSingleBlockComponent } from './components/update-single-block/update-single-block.component';

@NgModule({
  declarations: [
    SingleBlockComponent,
    ModalComponent,
    DecisionComponent,
    ActionComponent,
    UpdateSingleBlockComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    AngularDraggableModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
  ],
  // providers: [UpdateSingleBlockComponent],
  exports: [
    SingleBlockComponent,
    UpdateSingleBlockComponent,
    ModalComponent,
    DecisionComponent,
    ActionComponent,
  ],
})
export class SharedModule {}
