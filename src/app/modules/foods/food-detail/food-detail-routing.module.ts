import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodDetailComponent } from './food-detail.component';

const routes: Routes = [{ path: ':id', component: FoodDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoodDetailRoutingModule { }
