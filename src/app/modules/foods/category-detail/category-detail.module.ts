import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryDetailRoutingModule } from './category-detail-routing.module';
import { CategoryDetailComponent } from './category-detail.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [CategoryDetailComponent],
  imports: [CommonModule, CategoryDetailRoutingModule, CarouselModule],
})
export class CategoryDetailModule {}
