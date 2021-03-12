import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlatterComponent } from './platter.component'

const routes: Routes = [{ path: '', component: PlatterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatterRoutingModule { }
