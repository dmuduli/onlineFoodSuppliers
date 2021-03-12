import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FoodsRoutingModule } from './foods-routing.module';
import { FoodsComponent } from './foods.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule } from '@angular/forms';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { AngularMaterialModule } from '../shared/angular-material.module';

import { FoodService } from '../shared/services/food.service';
import { FoodBeveragesComponent } from './food-beverages/food-beverages.component';
import { DesertsComponent } from './deserts/deserts.component';
import { MealComponent } from './meal/meal.component';
import { PlatterComponent } from './platter/platter.component';

@NgModule({
  declarations: [FoodsComponent, PlaceOrderComponent, FoodBeveragesComponent, DesertsComponent, MealComponent, PlatterComponent],
  imports: [
    CommonModule,
    FoodsRoutingModule,
    CarouselModule,
    AngularMaterialModule,
    FormsModule
  ],
  providers: [FoodService],
})
export class FoodsModule {}
