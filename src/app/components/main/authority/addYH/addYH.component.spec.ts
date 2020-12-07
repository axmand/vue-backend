import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddYHComponent } from './addYH.component';

describe('AddYHComponent', () => {
  let component: AddYHComponent;
  let fixture: ComponentFixture<AddYHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddYHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddYHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
