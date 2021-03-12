import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FoodNorthindianRoutingModule } from './food-northindian-routing.module';
import { FoodNorthindianComponent } from './food-northindian.component';

import { CarouselModule } from 'ngx-owl-carousel-o';
@NgModule({
  declarations: [FoodNorthindianComponent],
  imports: [
    CommonModule,
    FoodNorthindianRoutingModule,
    CarouselModule
  ]
})
export class FoodNorthindianModule { }
