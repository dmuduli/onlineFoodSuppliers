import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveReviewRoutingModule } from './leave-review-routing.module';
import { LeaveReviewComponent } from './leave-review.component';
import { AngularMaterialModule } from '../../shared/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [LeaveReviewComponent],
  imports: [
    CommonModule,
    LeaveReviewRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class LeaveReviewModule {}
