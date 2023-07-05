import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleBlockComponent } from './components/single-block/single-block.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularDraggableModule } from 'angular2-draggable';
import { ModalComponent } from './components/modal/modal.component';
import { DecisionComponent } from './components/decision/decision.component';
import { ActionComponent } from './components/action/action.component';

@NgModule({
  declarations: [
    SingleBlockComponent,
    ModalComponent,
    DecisionComponent,
    ActionComponent,
  ],
  imports: [CommonModule, DragDropModule, AngularDraggableModule],
  exports: [
    SingleBlockComponent,
    ModalComponent,
    DecisionComponent,
    ActionComponent,
  ],
})
export class SharedModule {}
