import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientalComponent } from './oriental.component';

describe('OrientalComponent', () => {
  let component: OrientalComponent;
  let fixture: ComponentFixture<OrientalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrientalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrientalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
