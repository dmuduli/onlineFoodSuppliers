import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutFoodComponent } from './checkout-food.component';

describe('CheckoutFoodComponent', () => {
  let component: CheckoutFoodComponent;
  let fixture: ComponentFixture<CheckoutFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutFoodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
