import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurdService } from '../shared/services/auth.gaurd.service';
import { ProfileComponent } from './profile/profile.component';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { PersonaldetailsComponent } from './personaldetails/personaldetails.component';
import { AddressbookComponent } from './addressbook/addressbook.component';
import { MyordersComponent } from './myorders/myorders.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { SignoutComponent } from './signout/signout.component';

import { flush } from '@angular/core/testing';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'myaccount',
        component: MyaccountComponent,
        canActivate: [AuthGaurdService],
      },
      {
        path: 'personaldetails',
        component: PersonaldetailsComponent,
        canActivate: [AuthGaurdService],
      },
      {
        path: 'addressbook',
        component: AddressbookComponent,
        canActivate: [AuthGaurdService],
      },
      {
        path: 'myorders',
        component: MyordersComponent,
        canActivate: [AuthGaurdService],
      },
      {
        path: 'changepassword',
        component: ChangepasswordComponent,
        canActivate: [AuthGaurdService],
      },
      {
        path: 'signout',
        component: SignoutComponent,
        canActivate: [AuthGaurdService],
      },
      {
        path: '',
        redirectTo: 'myaccount',
        pathMatch: 'full',
        canActivate: [AuthGaurdService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
