import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFieldComponent } from './dynamic-field.component';

describe('DynamicFieldComponent', () => {
  let component: DynamicFieldComponent;
  let fixture: ComponentFixture<DynamicFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFieldComponent]
    });
    fixture = TestBed.createComponent(DynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
