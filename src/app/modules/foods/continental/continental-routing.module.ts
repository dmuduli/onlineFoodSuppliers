import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContinentalComponent } from './continental.component'

const routes: Routes = [{ path: '', component: ContinentalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContinentalRoutingModule { }
