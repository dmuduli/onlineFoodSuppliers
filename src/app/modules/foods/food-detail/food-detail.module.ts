import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FoodDetailRoutingModule } from './food-detail-routing.module';
import { FoodDetailComponent } from './food-detail.component';


@NgModule({
  declarations: [FoodDetailComponent],
  imports: [
    CommonModule,
    FoodDetailRoutingModule
  ]
})
export class FoodDetailModule { }
