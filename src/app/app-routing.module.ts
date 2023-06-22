import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowBuilderComponent } from './workflow-builder/workflow-builder.component';

const routes: Routes = [
  { path: 'builder', component: WorkflowBuilderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
