import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBlockComponent } from './single-block.component';

describe('SingleBlockComponent', () => {
  let component: SingleBlockComponent;
  let fixture: ComponentFixture<SingleBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleBlockComponent]
    });
    fixture = TestBed.createComponent(SingleBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
