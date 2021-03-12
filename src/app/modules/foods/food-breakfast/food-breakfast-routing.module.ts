import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodBreakfastComponent } from './food-breakfast.component'

const routes: Routes = [{ path: '', component: FoodBreakfastComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoodBreakfastRoutingModule { }
