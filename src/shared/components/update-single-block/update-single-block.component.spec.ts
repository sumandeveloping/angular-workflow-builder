import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSingleBlockComponent } from './update-single-block.component';

describe('UpdateSingleBlockComponent', () => {
  let component: UpdateSingleBlockComponent;
  let fixture: ComponentFixture<UpdateSingleBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSingleBlockComponent]
    });
    fixture = TestBed.createComponent(UpdateSingleBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
