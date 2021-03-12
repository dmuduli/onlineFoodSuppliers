import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationComponent } from './modals/location/location.component';
import { ConfirmationDialogComponent } from './modals/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [SharedComponent, LocationComponent, ConfirmationDialogComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
