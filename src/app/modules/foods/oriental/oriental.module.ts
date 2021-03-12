import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrientalRoutingModule } from './oriental-routing.module';
import { OrientalComponent } from './oriental.component';

import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [OrientalComponent],
  imports: [
    CommonModule,
    OrientalRoutingModule,
    CarouselModule
  ]
})
export class OrientalModule { }
