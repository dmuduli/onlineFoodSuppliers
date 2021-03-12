import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChefDetailRoutingModule } from './chef-detail-routing.module';
import { ChefDetailComponent } from './chef-detail.component';


@NgModule({
  declarations: [ChefDetailComponent],
  imports: [
    CommonModule,
    ChefDetailRoutingModule
  ]
})
export class ChefDetailModule { }
