import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FoodSouthindianRoutingModule } from './food-southindian-routing.module';
import { FoodSouthindianComponent } from './food-southindian.component';

import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [FoodSouthindianComponent],
  imports: [
    CommonModule,
    FoodSouthindianRoutingModule,
    CarouselModule
  ]
})
export class FoodSouthindianModule { }
