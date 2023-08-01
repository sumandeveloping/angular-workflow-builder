import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSelectComponent } from './dynamic-select.component';

describe('DynamicSelectComponent', () => {
  let component: DynamicSelectComponent;
  let fixture: ComponentFixture<DynamicSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSelectComponent]
    });
    fixture = TestBed.createComponent(DynamicSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
