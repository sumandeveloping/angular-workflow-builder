import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkflowBuilderComponent } from './workflow-builder/workflow-builder.component';
import { SharedModule } from 'src/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [AppComponent, WorkflowBuilderComponent],
  imports: [BrowserModule, AppRoutingModule, DragDropModule, SharedModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
