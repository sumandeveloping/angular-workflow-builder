import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleBlockComponent } from './components/single-block/single-block.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularDraggableModule } from 'angular2-draggable';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [SingleBlockComponent, ModalComponent],
  imports: [CommonModule, DragDropModule, AngularDraggableModule],
  exports: [SingleBlockComponent, ModalComponent],
})
export class SharedModule {}
