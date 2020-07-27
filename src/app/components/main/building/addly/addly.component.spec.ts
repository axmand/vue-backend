import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlyComponent } from './addly.component';

describe('AddlyComponent', () => {
  let component: AddlyComponent;
  let fixture: ComponentFixture<AddlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
