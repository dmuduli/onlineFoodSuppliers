import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodSouthindianComponent } from './food-southindian.component'

const routes: Routes = [{ path: '', component: FoodSouthindianComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoodSouthindianRoutingModule { }
