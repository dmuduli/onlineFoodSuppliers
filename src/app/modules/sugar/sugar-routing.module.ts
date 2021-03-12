import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SugarComponent } from './sugar.component';

const routes: Routes = [{ path: '', component: SugarComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SugarRoutingModule { }
