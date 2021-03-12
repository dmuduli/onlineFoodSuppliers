import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveReviewComponent } from './leave-review.component';

const routes: Routes = [{ path: ':itemId/:vendorId', component: LeaveReviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveReviewRoutingModule { }
