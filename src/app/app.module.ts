import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkflowBuilderComponent } from './workflow-builder/workflow-builder.component';
import { SharedModule } from 'src/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UpdateWorkflowBuilderComponent } from './update-workflow-builder/update-workflow-builder.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    WorkflowBuilderComponent,
    UpdateWorkflowBuilderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DragDropModule,
    SharedModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [WorkflowBuilderComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
