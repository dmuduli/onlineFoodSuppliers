import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AngularMaterialModule } from '../shared/angular-material.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CarouselModule,
    AngularMaterialModule,
  ],
})
export class DashboardModule {}
