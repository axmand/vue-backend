import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAPIComponent } from './open-api.component';

describe('OpenAPIComponent', () => {
  let component: OpenAPIComponent;
  let fixture: ComponentFixture<OpenAPIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenAPIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
