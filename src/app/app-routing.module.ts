import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCheckoutGaurdService } from './modules/shared/services/auth-checkout.gaurd.service';
import { AuthGaurdService } from './modules/shared/services/auth.gaurd.service';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [AuthCheckoutGaurdService],
  },
  {
    path: 'shared',
    loadChildren: () =>
      import('./modules/shared/shared.module').then((m) => m.SharedModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./modules/cart/cart.module').then((m) => m.CartModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'foods',
    loadChildren: () =>
      import('./modules/foods/foods.module').then((m) => m.FoodsModule),
  },
  {
    path: 'terms-condition',
    loadChildren: () =>
      import('./modules/terms-and-condition/terms-and-condition.module').then(
        (m) => m.TermsAndConditionModule
      ),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./modules/privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyModule
      ),
  },
  {
    path: 'about-us',
    loadChildren: () =>
      import('./modules/about-us/about-us.module').then((m) => m.AboutUsModule),
  },
  {
    path: 'contact-us',
    loadChildren: () =>
      import('./modules/contact-us/contact-us.module').then(
        (m) => m.ContactUsModule
      ),
  },
  {
    path: 'faq',
    loadChildren: () =>
      import('./modules/faq/faq.module').then((m) => m.FaqModule),
  },
  {
    path: 'sugar-spice',
    loadChildren: () =>
      import('./modules/sugar/sugar.module').then((m) => m.SugarModule),
  },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
