import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteYHComponent } from './delete-yh.component';

describe('DeleteYHComponent', () => {
  let component: DeleteYHComponent;
  let fixture: ComponentFixture<DeleteYHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteYHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteYHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
