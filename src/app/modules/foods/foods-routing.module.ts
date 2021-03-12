import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodsComponent } from './foods.component';

const routes: Routes = [
  { path: '', component: FoodsComponent },
  {
    path: 'category/:id',
    loadChildren: () =>
      import('./food-breakfast/food-breakfast.module').then(
        (m) => m.FoodBreakfastModule
      ),
  },
  {
    path: 'northindian',
    loadChildren: () =>
      import('./food-northindian/food-northindian.module').then(
        (m) => m.FoodNorthindianModule
      ),
  },
  {
    path: 'southindian',
    loadChildren: () =>
      import('./food-southindian/food-southindian.module').then(
        (m) => m.FoodSouthindianModule
      ),
  },
  {
    path: 'continental',
    loadChildren: () =>
      import('./continental/continental.module').then(
        (m) => m.ContinentalModule
      ),
  },
  {
    path: 'oriental',
    loadChildren: () =>
      import('./oriental/oriental.module').then((m) => m.OrientalModule),
  },
  {
    path: 'beverages',
    loadChildren: () =>
      import('./food-beverages/food-beverages.module').then(
        (m) => m.FoodBeveragesModule
      ),
  },
  {
    path: 'meal',
    loadChildren: () => import('./meal/meal.module').then((m) => m.MealModule),
  },
  {
    path: 'deserts',
    loadChildren: () =>
      import('./deserts/deserts.module').then((m) => m.DesertsModule),
  },
  {
    path: 'platter',
    loadChildren: () =>
      import('./platter/platter.module').then((m) => m.PlatterModule),
  },
  {
    path: 'detail',
    loadChildren: () =>
      import('./food-detail/food-detail.module').then(
        (m) => m.FoodDetailModule
      ),
  },
  {
    path: 'chef',
    loadChildren: () =>
      import('./chef-detail/chef-detail.module').then(
        (m) => m.ChefDetailModule
      ),
  },
  {
    path: 'leave-review',
    loadChildren: () =>
      import('./leave-review/leave-review.module').then(
        (m) => m.LeaveReviewModule
      ),
  },
  {
    path: 'category-detail/:id',
    loadChildren: () =>
      import('./category-detail/category-detail.module').then(
        (m) => m.CategoryDetailModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodsRoutingModule {}
