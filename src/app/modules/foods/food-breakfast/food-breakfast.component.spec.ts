import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodBreakfastComponent } from './food-breakfast.component';

describe('FoodBreakfastComponent', () => {
  let component: FoodBreakfastComponent;
  let fixture: ComponentFixture<FoodBreakfastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodBreakfastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodBreakfastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
