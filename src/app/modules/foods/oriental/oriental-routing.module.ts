import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrientalComponent } from './oriental.component'

const routes: Routes = [{ path: '', component: OrientalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrientalRoutingModule { }
