import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowBuilderComponent } from './workflow-builder.component';

describe('WorkflowBuilderComponent', () => {
  let component: WorkflowBuilderComponent;
  let fixture: ComponentFixture<WorkflowBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowBuilderComponent]
    });
    fixture = TestBed.createComponent(WorkflowBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
