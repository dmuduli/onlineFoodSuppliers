import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesertsComponent } from './deserts.component'

const routes: Routes = [{ path: '', component: DesertsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesertsRoutingModule { }
