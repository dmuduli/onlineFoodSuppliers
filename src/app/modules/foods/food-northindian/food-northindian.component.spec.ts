import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodNorthindianComponent } from './food-northindian.component';

describe('FoodNorthindianComponent', () => {
  let component: FoodNorthindianComponent;
  let fixture: ComponentFixture<FoodNorthindianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodNorthindianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodNorthindianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
