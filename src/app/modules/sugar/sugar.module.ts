import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SugarRoutingModule } from './sugar-routing.module';
import { SugarComponent } from './sugar.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SugarComponent],
  imports: [
    CommonModule,
    SugarRoutingModule,
    CarouselModule,
    AngularMaterialModule,
    FormsModule,
  ],
})
export class SugarModule {}
