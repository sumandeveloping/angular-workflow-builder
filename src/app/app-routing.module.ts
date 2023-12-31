import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowBuilderComponent } from './workflow-builder/workflow-builder.component';
import { UpdateWorkflowBuilderComponent } from './update-workflow-builder/update-workflow-builder.component';

const routes: Routes = [
  { path: 'builder', component: WorkflowBuilderComponent },
  { path: 'builder/edit', component: UpdateWorkflowBuilderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
