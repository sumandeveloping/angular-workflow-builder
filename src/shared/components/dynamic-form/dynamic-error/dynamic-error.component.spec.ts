import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicErrorComponent } from './dynamic-error.component';

describe('DynamicErrorComponent', () => {
  let component: DynamicErrorComponent;
  let fixture: ComponentFixture<DynamicErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicErrorComponent]
    });
    fixture = TestBed.createComponent(DynamicErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
