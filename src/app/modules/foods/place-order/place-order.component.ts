import {
  Component,
  OnInit,
  Inject,
  ɵɵtrustConstantResourceUrl,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/modals/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { handleError } from '../../shared/helpers/error-handler';
import { CartService } from '../../shared/services/cart.service';
import { FoodService } from '../../shared/services/food.service';
import { AuthService } from '../../shared/services/auth.service';

export interface Item {
  ItemImageUrl: string;
  ItemName: string;
  ItemPrice: number;
  ItemQuantity: number;
  ItemItemId: string;
  ItemChecked: boolean;
}

export interface Order {
  OrderQuantity: number;
  OrderSize: string[];
  OrderItemName: string;
  OrderSimilarProducts: Item[];
  OrderItemId: string;
  OrderUserId: string;
  OrderPrice: number;
  OrderVendorId: string;
  OrderItemImgUrl: string;
}

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss'],
})
export class PlaceOrderComponent implements OnInit {
  orderData: Order;
  selectedSize: string;

  constructor(
    public dialogRef: MatDialogRef<PlaceOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private confirmdialog: MatDialog,
    private toastr: ToastrService,
    private foodService: FoodService,
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.orderData = {
      OrderQuantity: 1,
      OrderSize: [],
      OrderItemName: '',
      OrderSimilarProducts: [],
      OrderItemId: '',
      OrderUserId: '',
      OrderPrice: 0,
      OrderVendorId: '',
      OrderItemImgUrl: '',
    };
    this.selectedSize = '';
  }

  ngOnInit(): void {
    //console.log(this.data.data);
    this.loadOrderForm(this.data.data);
  }

  loadOrderForm(data: any) {
    this.cartService.getItemDetails(data.ItemItemId).subscribe((resp: any) => {
      //console.log(resp);

      this.orderData.OrderItemId = resp.itemId;
      this.orderData.OrderItemName = resp.itemname;
      this.orderData.OrderQuantity = 1;
      this.orderData.OrderSize = resp.size;
      this.orderData.OrderPrice = resp.price;
      this.orderData.OrderItemImgUrl = resp.imagePath;
      this.orderData.OrderVendorId = resp.VendorVendorId;
      this.loadOtherChefProducts(this.orderData.OrderVendorId);
      //console.log( this.orderData);
    });
  }

  loadOtherChefProducts(vendorId: string) {
    this.foodService.getSimilarProducts(vendorId).subscribe((resp: any) => {
      //console.log(resp);
      this.orderData.OrderSimilarProducts = [];
      for (let item of resp) {
        let currItem: Item = {
          ItemImageUrl: item.imagePath,
          ItemName: item.itemname,
          ItemPrice: item.price,
          ItemItemId: item.itemId,
          ItemQuantity: 1,
          ItemChecked: false,
        };
        if (currItem.ItemItemId != this.orderData.OrderItemId)
          this.orderData.OrderSimilarProducts.push(currItem);
      }
    });
  }

  incOrderQuantity() {
    this.orderData.OrderQuantity += 1;
  }

  decOrderQuantity() {
    if (this.orderData.OrderQuantity > 1) {
      this.orderData.OrderQuantity -= 1;
    }
  }

  incSimProdQuantity(itemid: string) {
    this.orderData.OrderSimilarProducts.forEach((element) => {
      if (element.ItemItemId == itemid) {
        element.ItemQuantity += 1;
      }
    });
  }

  decSimProdQuantity(itemid: string) {
    this.orderData.OrderSimilarProducts.forEach((element) => {
      if (element.ItemItemId == itemid && element.ItemQuantity > 1) {
        element.ItemQuantity -= 1;
      }
    });
  }

  addToCart() {
    //check the items selected already exists in cart
    // console.log(this.orderData);
    const userId = this.authService.getUserId();
    // console.log(userId);
    if (userId) {
      this.cartService
        .checkItemExistsInCart(this.orderData)
        .subscribe((resp: any) => {
          //if the item doesn't exists create  a new cart
          if (resp.status == '204') {
            //create a new cart with items
            this.cartService.addItemsTocart(this.orderData).subscribe(
              (resp: any) => {
                this.toastr.success('Item is added to cart', 'Success!!');
                this.dialogRef.close();
              },
              (err: any) => {
                handleError(err);
              }
            );
          }
          //if the item exists confirm with user to update the existing cart
          else if (resp.status == '200') {
            const confirmdialogRef = this.confirmdialog.open(
              ConfirmationDialogComponent,
              {
                data: {
                  message:
                    'Item exists in cart!! Do you want to proceed and modify the existing order ?',
                },
              }
            );
            confirmdialogRef.afterClosed().subscribe((result) => {
              if (result) {
                //update the existing items in the cart
                this.cartService
                  .updateAddItemsToExistingCart(this.orderData)
                  .subscribe(
                    (resp: any) => {
                      this.toastr.success(
                        'cart items are updated/added successfully',
                        'Success!!'
                      );
                    },
                    (err: any) => {
                      handleError(err);
                    }
                  );
              }
              this.dialogRef.close();
            });
          }
        });
    } else {
      const cart: any = sessionStorage.getItem('cartData')
        ? sessionStorage.getItem('cartData')
        : '';
      // console.log(cart);
      const cartData = JSON.parse(cart);
      const mainIndex = cartData.findIndex(
        (cartObj: any) => cartObj.itemId === this.orderData.OrderItemId
      );
      if (mainIndex === -1) {
        cartData.push({
          itemId: this.orderData.OrderItemId,
          Name: this.orderData.OrderItemName,
          quantity: this.orderData.OrderQuantity,
          Price: this.orderData.OrderPrice,
          imgUrl: this.orderData.OrderItemImgUrl,
          vendorId: this.orderData.OrderVendorId,
        });
      } else {
        cartData[mainIndex].quantity += this.orderData.OrderQuantity;
      }
      const selectedSimilar = this.orderData.OrderSimilarProducts.filter(
        (item) => item.ItemChecked
      );
      selectedSimilar.forEach((item: any) => {
        const index = cartData.findIndex(
          (cartObj: any) => cartObj.itemId === item.ItemItemId
        );
        if (index === -1) {
          cartData.push({
            itemId: item.ItemItemId,
            Name: item.ItemName,
            quantity: item.ItemQuantity,
            Price: item.ItemPrice,
            imgUrl: item.ItemImageUrl,
            vendorId: this.orderData.OrderVendorId,
          });
        } else {
          cartData[index].quantity += item.ItemQuantity;
        }
      });
      // console.log(cartData);
      sessionStorage.setItem('cartData', JSON.stringify(cartData));
      this.cartService.updateGuestCart();
      this.dialogRef.close();
    }
  }
}
