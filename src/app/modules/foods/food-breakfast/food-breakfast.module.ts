import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FoodBreakfastRoutingModule } from './food-breakfast-routing.module';
import { FoodBreakfastComponent } from './food-breakfast.component';

import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [FoodBreakfastComponent],
  imports: [
    CommonModule,
    FoodBreakfastRoutingModule,
    CarouselModule
  ]
})
export class FoodBreakfastModule { }
