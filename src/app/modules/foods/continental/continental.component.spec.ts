import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinentalComponent } from './continental.component';

describe('ContinentalComponent', () => {
  let component: ContinentalComponent;
  let fixture: ComponentFixture<ContinentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContinentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
