import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodSouthindianComponent } from './food-southindian.component';

describe('FoodSouthindianComponent', () => {
  let component: FoodSouthindianComponent;
  let fixture: ComponentFixture<FoodSouthindianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodSouthindianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodSouthindianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
