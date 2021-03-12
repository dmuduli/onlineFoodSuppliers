import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart/cart.component';
import { CheckoutFoodComponent } from './checkout-food/checkout-food.component';

import { CartService } from '../shared/services/cart.service';

@NgModule({
  declarations: [CartComponent, CheckoutFoodComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    ReactiveFormsModule
  ]
})
export class CartModule { }
