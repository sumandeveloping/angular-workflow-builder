import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleBlockComponent } from './components/single-block/single-block.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
  declarations: [SingleBlockComponent],
  imports: [CommonModule, DragDropModule, AngularDraggableModule],
  exports: [SingleBlockComponent],
})
export class SharedModule {}
