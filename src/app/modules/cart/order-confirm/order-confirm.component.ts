import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { handleError } from '../../shared/helpers/error-handler';
import { CartService } from '../../shared/services/cart.service'

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.scss']
})
export class OrderConfirmComponent implements OnInit {
  orderAddress : any;
  orderData : any;
  orderId: string;
  constructor(private cartService : CartService,
    private activatedRoute: ActivatedRoute) 
  {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.loadOrderDetails();
  }

  loadOrderDetails()
  {
    this.cartService.getOrderDetails(this.orderId).subscribe((data:any)=>{
      // console.log(JSON.stringify(data));
      this.orderData = data;
      this.orderAddress = JSON.parse(data.address);
    },
    (err:any)=>{
      handleError(err);
    });
  }

}
