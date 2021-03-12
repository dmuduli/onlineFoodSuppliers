import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContinentalRoutingModule } from './continental-routing.module';
import { ContinentalComponent } from './continental.component';

import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [ContinentalComponent],
  imports: [
    CommonModule,
    ContinentalRoutingModule,
    CarouselModule
  ]
})
export class ContinentalModule { }
