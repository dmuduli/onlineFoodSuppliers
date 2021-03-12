import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common' 

import { ProfileService } from '../../shared/services/profile.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface order{
  productName : string,
  productImage : string,
  OrderDate : Date,
  productTotPrice : number,
  deliveredDate : Date
}

export interface GridPage
{
  currPageNo : number,
  TotalItems : number,
  itemsPerPage : number
}

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss']
})

export class MyordersComponent implements OnInit {
  orderData: order[];
  orderPage : GridPage;
  formatDate : any = formatDate;

  constructor(private profileService : ProfileService) {
    this.profileService.setMobileMenuDisplayStatus(true);
    this.orderData = [];
    this.orderPage = {
      currPageNo : 1,
      TotalItems : 0,
      itemsPerPage : 2
    };
  }

  ngOnInit(): void {
    this.loadOrderDetails();
  }

  loadOrderDetails()
  {
    this.profileService.getOrderDetails(this.orderPage.currPageNo).subscribe(
      (resp:any) => {
        //console.log(resp);
        this.orderPage.TotalItems = resp.count;
        if(resp.rows && resp.rows.length > 0)
        {
          this.orderData = [];
          resp.rows.forEach((element : any) => {
            element.itemList = JSON.parse(element.itemList);
            this.orderData.push(
              {
                productName : element.itemList.map((item : any) => item.Name).join(','),
                productImage : '',
                OrderDate : element.created_at,
                productTotPrice : element.TotalPrice,
                deliveredDate : element.updated_at
              }
            );
          });

        }
      },
      err => console.log(err));
  }

  orderPageEvents(event: any)
  {
    // console.log(event.pageIndex);
    // console.log(event.pageSize);
    if(event.pageIndex == this.orderPage.currPageNo && this.orderPage.currPageNo < Math.ceil(this.orderPage.TotalItems/this.orderPage.itemsPerPage))
    {
      this.orderPage.currPageNo += 1;
      this.loadOrderDetails();
    }
    else if(event.pageIndex < this.orderPage.currPageNo && this.orderPage.currPageNo > 1)
    {
      this.orderPage.currPageNo -= 1;
      this.loadOrderDetails();
    }
  }

}
