import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodBeveragesComponent } from './food-beverages.component'

const routes: Routes = [{ path: '', component: FoodBeveragesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoodBeveragesRoutingModule { }
