import { stringify } from '@angular/compiler/src/util';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  forkJoin,
  Observable,
  Subject,
  throwError,
} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItemCountChange: BehaviorSubject<Number> = new BehaviorSubject<Number>(0);
  cartCount: Number = 0;
  cartGuestData: BehaviorSubject<any>;
  guestData: Observable<any>;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.cartGuestData = new BehaviorSubject<any>(
      sessionStorage.getItem('cartData')
    );
    this.guestData = this.cartGuestData.asObservable();
  }

  updateGuestCart() {
    this.cartGuestData.next(sessionStorage.getItem('cartData'));
  }

  public get guestCart(): any {
    return this.cartGuestData.value;
  }

  getProductsInUserCart(): Observable<any> {
    let userId = this.authService.getUserId();
    let userCartItems: any;
    return this.http.get(`${environment.apiUrl}/usercart/${userId}`).pipe(
      tap((resp) => {
        this.getCartCountAPIResp();
      })
    );
  }

  getItemDetails(itemId: string): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/itemdetails/${itemId}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  getItemDetailsInBulk(cartItems: any): Observable<any[]> {
    let obsArr = [];
    for (let item of cartItems) {
      if (item.ItemItemId != null)
        obsArr.push(
          this.http.get(`${environment.apiUrl}/itemdetails/${item.ItemItemId}`)
        );
    }
    return forkJoin(obsArr).pipe(catchError((err) => this.handleError(err)));
  }

  getCartItemCount(): Observable<Number> {
    return this.cartItemCountChange.asObservable();
  }

  getCartCountAPIResp() {
    let userId = this.authService.getUserId();
    if (userId != null) {
      this.http
        .get(`${environment.apiUrl}/countitemincart/${userId}`)
        .subscribe(
          (resp: any) => {
            //console.log('Resp from service : ' + resp);
            this.cartItemCountChange.next(Number(resp));
          },
          (err: any) => {
            this.handleError(err);
          }
        );
    }
  }

  UpdateProductsInUserCart(
    cartProducts: any,
    updatedCarts: Map<string, number>
  ): Observable<any> {
    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    let updatedProd: Map<
      string,
      {
        itemId: string;
        Name: string;
        quantity: number;
        Price: number;
        imgUrl: string;
        vendorId: string;
      }[]
    > = new Map();
    // console.log('upd prod : ' +JSON.stringify(cartProducts));
    for (let item of cartProducts) {
      if (updatedCarts.has(item.ItemCartId)) {
        let val: {
          itemId: string;
          Name: string;
          quantity: number;
          Price: number;
          imgUrl: string;
          vendorId: string;
        }[] = [];
        if (updatedProd.has(item.ItemCartId)) {
          val = updatedProd.get(item.ItemCartId)!;
        }
        val?.push({
          itemId: item.ItemItemId,
          Name: item.ItemName,
          quantity: item.ItemQuantity,
          Price: item.ItemPrice,
          imgUrl: item.ItemImageUrl,
          vendorId: item.ItemVendorId,
        });
        updatedProd.set(item.ItemCartId, val);
      }
    }

    let bodyJson: {
      cartId: String;
      details: {
        itemId: string;
        Name: string;
        quantity: Number;
        Price: Number;
        imgUrl: string;
        vendorId: string;
      }[];
    }[] = [];

    updatedProd.forEach((value, key) => {
      bodyJson.push({
        cartId: key,
        details: value,
      });
    });
    // console.log(JSON.stringify(bodyJson));
    return this.http
      .put(
        `${environment.apiUrl}/updatecart`,
        { cartdata: bodyJson },
        { headers: options, responseType: 'text' }
      )
      .pipe(
        tap((resp) => {
          this.getCartCountAPIResp();
        })
      );
  }

  // UpdateCartProductQty(updatedCartItems : any){
  //   const options  = new HttpHeaders({'Content-Type':'application/json'});
  //   console.log(JSON.stringify(updatedCartItems));
  //   return this.http.put(`${environment.apiUrl}/updatecart`,updatedCartItems,{headers : options}).pipe(
  //     catchError(err => this.handleError(err))
  //   );
  // }

  deleteProductInCart(cartId: string): Observable<any> {
    return this.http
      .delete(`${environment.apiUrl}/usercartdelete/${cartId}`, {
        responseType: 'text',
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  deleteItemInCart(cartId: string, itemId: string): Observable<any> {
    return this.http
      .put(
        `${environment.apiUrl}/removesingleitemfromcart`,
        { cartId, itemId },
        { responseType: 'text' }
      )
      .pipe(
        tap((resp) => {
          this.getCartCountAPIResp();
        })
      );
  }

  placeCustomerOrder(
    deliveryAddress: any,
    cartItems: any,
    totalPrice: number,
    deliveryQuote: any
  ): Observable<any> {
    let itemList: {
      ItemId: String;
      ItemCartId: String;
      Name: String;
      quantity: Number;
      Price: Number;
    }[] = [];

    let deliverydate = new Date();
    let deliveryTime = deliveryAddress.deliveryTime + ':00';

    // console.log('dt : ' + deliveryTime);

    if (deliveryAddress.deliveryDay == 'Tomorrow') {
      deliverydate.setDate(deliverydate.getDate() + 1);
    } else if (deliveryAddress.deliveryDay == 'AfterTomorrow') {
      deliverydate.setDate(deliverydate.getDate() + 2);
    } else if (deliveryAddress.deliveryDay == 'Overmorrow') {
      deliverydate.setDate(deliverydate.getDate() + 3);
    }

    let year = deliverydate.getFullYear();
    let month = deliverydate.getMonth() + 1; // Jan is 0, dec is 11
    let day = deliverydate.getDate();
    let dateString =
      '' + year + '-' + ('00' + month).slice(-2) + '-' + ('00' + day).slice(-2);

    let orderData = {
      userId: this.authService.getUserId(),
      TotalPrice: totalPrice,
      itemList: itemList,
      vendorId : cartItems[0].ItemVendorId,
      Address: {
        fullName: deliveryAddress.fullName,
        address: deliveryAddress.address,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        pinCode: deliveryAddress.pinCode,
        location: deliveryAddress.deliveryLocation,
      },
      deliveryType: deliveryAddress.deliveryType,
      deliveryDate: dateString + 'T' + deliveryTime,
      deliveryDay: deliveryAddress.deliveryDay,
      deliveryTime: deliveryAddress.deliveryTime,
      deliverypartner: deliveryQuote.partner,
      deliveryprice: deliveryQuote.cost,
      deliverylocation : deliveryQuote.location
    };

    for (let item of cartItems) {
      orderData.itemList.push({
        ItemId: item.ItemItemId,
        ItemCartId: item.ItemCartId,
        Name: item.ItemName,
        quantity: item.ItemQuantity,
        Price: item.ItemPrice,
      });
    }

    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    // console.log(JSON.stringify(orderData));
    return this.http
      .post(`${environment.apiUrl}/customerorder`, orderData, {
        headers: options,
      })
      .pipe(
        tap((resp) => {
          this.getCartCountAPIResp();
        })
      );
  }

  addDeliveryAddress(
    deliveryData: any //: Observable<any>
  ) {
    // const options  = new HttpHeaders({'Content-Type':'application/json'});
    // return this.http.post(`${environment.apiUrl}/Cart/DeliveryAddress`,deliveryData,{headers : options}).pipe(
    //   catchError(err => this.handleError(err))
    // )
    //Sample Json for Post:
    // address: "Tambaram"
    // city: "Chennai"
    // deliveryDay: "Tomorrow"
    // deliveryLocation: "Chennai"
    // deliveryTime: "08.00"
    // deliveryType: "now"
    // fullName: "Venkat"
    // pinCode: "631745"
    // state: "Sikkim"
  }

  addItemsTocart(item: any): Observable<any> {
    let cartItems: {
      itemId: string;
      Name: string;
      quantity: Number;
      Price: Number;
      imgUrl: string;
      vendorId: string;
    }[] = [];

    //push the initial ordered item into array
    cartItems.push({
      itemId: item.OrderItemId,
      Name: item.OrderItemName,
      quantity: item.OrderQuantity,
      Price: item.OrderPrice,
      imgUrl: item.OrderItemImgUrl,
      vendorId: item.OrderVendorId,
    });

    //push the other similar items selected into array
    if (item.OrderSimilarProducts && item.OrderSimilarProducts.length > 0) {
      for (let product of item.OrderSimilarProducts) {
        if (product.ItemChecked) {
          cartItems.push({
            itemId: product.ItemItemId,
            Name: product.ItemName,
            quantity: product.ItemQuantity,
            Price: product.ItemPrice,
            imgUrl: product.ItemImageUrl,
            vendorId: item.OrderVendorId,
          });
        }
      }
    }

    //do a put api request to add the items to cart
    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    let userId = this.authService.getUserId();
    let bodyJson = { details: cartItems, userId: userId };
    //console.log(JSON.stringify(bodyJson));
    return this.http
      .post(`${environment.apiUrl}/addtocart`, bodyJson, { headers: options })
      .pipe(
        tap((resp) => {
          this.getCartCountAPIResp();
        })
      );
  }

  addGuestCart(item: any): Observable<any> {
    //do a put api request to add the items to cart
    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    let userId = this.authService.getUserId();
    let bodyJson = { details: item, userId: userId };
    //console.log(JSON.stringify(bodyJson));
    return this.http
      .post(`${environment.apiUrl}/addtocart`, bodyJson, { headers: options })
      .pipe(
        tap((resp) => {
          this.getCartCountAPIResp();
        })
      );
  }

  checkItemExistsInCart(item: any): Observable<any> {
    let items: string[] = [];
    items.push(item.OrderItemId);

    if (item.OrderSimilarProducts && item.OrderSimilarProducts.length > 0) {
      for (let product of item.OrderSimilarProducts) {
        if (product.ItemChecked) {
          items.push(product.ItemItemId);
        }
      }
    }

    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    let userId = this.authService.getUserId();
    let bodyJson = { userId: userId, items: items };
    //console.log(bodyJson);
    return this.http
      .post(`${environment.apiUrl}/usercartcheck`, bodyJson, {
        headers: options,
        responseType: 'text',
        observe: 'response',
      })
      .pipe(
        tap((resp) => {
          //this.getCartCountAPIResp();
        })
      );
  }

  getRecentOrderedItems(): Observable<any> {
    let userId = this.authService.getUserId();
    return this.http
      .get(`${environment.apiUrl}/recentorderapi/${userId}`);
      // .pipe(catchError((err) => this.handleError(err)));
  }

  updateAddItemsToExistingCart(item: any): Observable<any> {
    let cartItems: {
      itemId: string;
      Name: string;
      quantity: Number;
      Price: Number;
      imgUrl: string;
      vendorId: string;
    }[] = [];

    //push the initial ordered item into array
    cartItems.push({
      itemId: item.OrderItemId,
      Name: item.OrderItemName,
      quantity: item.OrderQuantity,
      Price: item.OrderPrice,
      imgUrl: item.OrderItemImgUrl,
      vendorId: item.orderVendorId,
    });

    //push the other similar items selected into array
    if (item.OrderSimilarProducts && item.OrderSimilarProducts.length > 0) {
      for (let product of item.OrderSimilarProducts) {
        if (product.ItemChecked) {
          cartItems.push({
            itemId: product.ItemItemId,
            Name: product.ItemName,
            quantity: product.ItemQuantity,
            Price: product.ItemPrice,
            imgUrl: product.ItemImageUrl,
            vendorId: item.orderVendorId,
          });
        }
      }
    }

    let userId = this.authService.getUserId();
    let bodyJson = { details: cartItems, userId: userId };
    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    // console.log(bodyJson);
    return this.http
      .put(`${environment.apiUrl}/updateAddItemsInCart`, bodyJson, {
        headers: options,
      })
      .pipe(
        tap((resp) => {
          this.getCartCountAPIResp();
        })
      );
  }

  getRazorPaymentData(
    cartItems: any,
    totalPrice: number,
    rzOrderId: string,
    OrderId: string
  ): any {
    let userVal: any = this.authService.userValue;
    let rzPayNotes: any = {
      userName: userVal?.user.firstname,
      email: userVal?.user.email_Id,
    };
    // console.log(userVal);
    for (let item of cartItems) {
      for (let i = 0; i < cartItems.length; i++) {
        rzPayNotes['item' + i] = `itemName: ${cartItems[i].ItemName},
        quantity: ${cartItems[i].ItemQuantity},
        price: ${cartItems[i].ItemQuantity}`;
      }
    }
    // console.log(rzPayNotes);
    let data = {
      key: environment.razorPayKeyId,
      amount: totalPrice * 100, // amount should be in paise format
      currency: 'INR',
      name: 'Homemade', // company name or product name
      description: OrderId, // product description
      image: './assets/images/logo.svg', // company logo or product image
      order_id: rzOrderId, // order_id returned by razorpay
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: rzPayNotes,
      prefill: {
        name: userVal?.user.firstname,
        email: userVal?.user.email_Id,
        contact: '91' + userVal?.user.mobileNumber,
      },
      theme: {
        color: '#444',
      },
    };
    return data;
  }

  verifyAndCapturePayment(rzDetails: any, orderId: string): Observable<any> {
    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    let userId = this.authService.getUserId();
    let bodyJSON = {
      rzPayOrderId: rzDetails.razorpay_order_id,
      orderId: orderId,
      rzPayPaymentId: rzDetails.razorpay_payment_id,
      rzsignature: rzDetails.razorpay_signature,
      userId,
    };
    return this.http
      .post(`${environment.apiUrl}/verifypayment`, bodyJSON, {
        headers: options,
      })
      .pipe(
        tap((resp) => {
          this.getCartCountAPIResp();
        })
      );
  }

  logErrorPayment(
    rzOrderId: string,
    rzPaymentId: string,
    orderId: string,
    error: any
  ): Observable<any> {
    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    let userId = this.authService.getUserId();
    let bodyJSON = {
      rzPayOrderId: rzOrderId,
      orderId: orderId,
      rzPayPaymentId: rzPaymentId,
      userId,
      error: {
        code: error.code,
        description: error.description,
        source: error.source,
        step: error.step,
        reason: error.reason,
      },
    };
    return this.http.post(`${environment.apiUrl}/errorpayment`, bodyJSON, {
      headers: options,
    });
  }

  checkCancelledPaymentStatus() {
    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    let userId = this.authService.getUserId();
    let bodyJSON = {
      userId,
    };
    return this.http
      .post(`${environment.apiUrl}/checkcancelledpaymentstatus`, bodyJSON, {
        headers: options,
      })
      .pipe(
        tap((resp) => {
          this.getCartCountAPIResp();
        })
      );
  }

  createInvoice(invoiceData : any) : Observable<any>
  {
    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    let userVal: any = this.authService.userValue;
    let userName = userVal?.user.firstname;
    invoiceData['customerName'] = userName;
    // console.log(invoiceData);
    return this.http.post(`${environment.apiUrl}/invoice`,invoiceData,{ headers: options});
  }

  getOrderDetails(orderId : string) : Observable<any>
  {
    return this.http
      .get(`${environment.apiUrl}/orderdetails/${orderId}`);
  }

  handleError(errorObj: HttpErrorResponse): Observable<any> {
    console.log(errorObj);
    let errorMsg: any;
    if (typeof errorObj.error === 'string') {
      errorMsg = errorObj.error;
      this.toastr.error(errorObj.error, 'Error');
    } else if (typeof errorObj.error === 'object') {
      if ('errors' in errorObj.error) {
        errorMsg = errorObj.error.errors[0].message;
        this.toastr.error(errorMsg, 'Error');
      } else {
        errorMsg = errorObj.error.name;
        this.toastr.error(errorObj.error.name, 'Error');
      }
    } else {
      errorMsg = errorObj.message;
      this.toastr.error(errorObj.message, 'Error');
    }
    return throwError(errorMsg);
  }
}
