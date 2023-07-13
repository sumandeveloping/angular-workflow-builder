import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWorkflowBuilderComponent } from './update-workflow-builder.component';

describe('UpdateWorkflowBuilderComponent', () => {
  let component: UpdateWorkflowBuilderComponent;
  let fixture: ComponentFixture<UpdateWorkflowBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateWorkflowBuilderComponent]
    });
    fixture = TestBed.createComponent(UpdateWorkflowBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
