import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodNorthindianComponent } from './food-northindian.component'

const routes: Routes = [{ path: '', component: FoodNorthindianComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoodNorthindianRoutingModule { }
