import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CartService } from '../../shared/services/cart.service';
import { ProfileService } from '../../shared/services/profile.service';
import { WindowrefService } from '../../shared/services/windowref.service';
import { LocationService } from '../../shared/services/location.service';
import { DeliveryService } from '../../shared/services/delivery.service'
import {} from 'googlemaps';
import { handleError } from '../../shared/helpers/error-handler';

export interface Item {
  ItemImageUrl: string;
  ItemName: string;
  ItemQuantity: number;
  ItemPrice: number;
  ItemUpdated: boolean;
  ItemCartId: string;
  ItemItemId: string;
  ItemUserId: string;
  ItemVendorId: string;
}

export interface Quote{
  partner: string;
  cost: Number;
  location : {
    pickup : {
      lat : Number;
      lng : Number;
    },
    drop : {
      lat : Number;
      lng : Number;
    }
  };
}

@Component({
  selector: 'app-checkout-food',
  templateUrl: './checkout-food.component.html',
  styleUrls: ['./checkout-food.component.scss'],
})
export class CheckoutFoodComponent implements OnInit, AfterViewInit {
  displayOrderSummary: boolean = false;
  selectedDay: String;
  disableDateTime: boolean;
  deliveryForm: FormGroup;
  selectedTime: string;
  userCart: Item[];
  subTotal: number;
  subTotalWthDiscount: number;
  discount: number;
  total: number;
  deliveryCost: number;
  isScheduleNowSelected: boolean;
  googleRef: any;
  mapAutoComplete: any;
  @ViewChild('deliveryLocation') deliveryInput: ElementRef | any;
  submitted: boolean;
  allStateData: string[];
  razorPay: any;
  IsValidDelivery: boolean;
  deliveryQuote : Quote;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private profileService: ProfileService,
    private cartService: CartService,
    private authService: AuthService,
    private windowRef: WindowrefService,
    private locationService : LocationService,
    private deliveryService : DeliveryService
  ) {
    this.deliveryForm = new FormGroup({});
    this.selectedDay = '';
    this.disableDateTime = false;
    this.selectedTime = '';
    this.subTotal = 0;
    this.subTotalWthDiscount = 0;
    this.discount = 0;
    this.total = 0;
    this.deliveryCost = 0;
    this.IsValidDelivery = false;
    this.userCart = [];
    this.isScheduleNowSelected = true;
    this.googleRef = null;
    this.submitted = false;
    this.allStateData = [];
    this.razorPay = null;
    this.deliveryQuote = {} as any;
  }

  ngOnInit(): void {
    this.deliveryForm = this.formBuilder.group({
      deliveryLocation: '',
      deliveryType: ['', Validators.required],
      deliveryDay: ['', Validators.required],
      deliveryTime: ['', [Validators.required, this.isTimeValid()]],
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', [Validators.required, this.validateDeliveryLocation()]],
      state: ['', Validators.required],
      pinCode: ['', Validators.required],
    });
    this.onDeliveryFormValueChanges();
    //this.deliveryType?.setValue('now');
    this.loadUserCart();
    this.loadAddressDetails();
    this.validateDeliveryLocation();
    // this.calculateTotal();
    this.authService.setHeaderDisplayStatus(false);

    //whenever user changes delivery location calculate delivery cost
    this.deliveryForm.get("city")?.valueChanges.subscribe(x => {
      this.validateAndGetDeliveryCharges();
   })
  }

  ngAfterViewInit() {
    const options = {
      componentRestrictions: { country: 'IN' },
      fields: [
        'address_component',
        'formatted_address',
        'place_id',
        'geometry',
      ],
      radius: 8000,
      strictBounds: true,
      types: ['establishment'],
    } as google.maps.places.AutocompleteOptions;
    const mapAutoComplete = new google.maps.places.Autocomplete(
      this.deliveryInput.nativeElement,
      options
    );

    mapAutoComplete.setFields(['address_component']);
    mapAutoComplete.addListener('place_changed', () => {
      const place = mapAutoComplete?.getPlace();
      // console.log(place);

      // Get each component of the address from the place details,
      // and then fill-in the corresponding field on the form.
      if (place && place.address_components) {
        let address = '';
        let city = '';
        let state = '';
        let pinCode = '';

        for (const component of place.address_components) {
          const addressType = component.types;
          // console.log(addressType);
          if (
            addressType.indexOf('sublocality_level_2') !== -1 ||
            addressType.indexOf('sublocality_level_1') !== -1
          ) {
            address = address
              ? address + ', ' + component.long_name
              : component.long_name;
          } else if (addressType.indexOf('locality') !== -1) {
            city = component.long_name;
          } else if (
            addressType.indexOf('administrative_area_level_1') !== -1
          ) {
            state = component.long_name;
          } else if (addressType.indexOf('postal_code') !== -1) {
            pinCode = component.long_name;
          }
        }

        this.deliveryForm.patchValue({
          deliveryLocation: `${place.formatted_address}`,
          address: place.formatted_address,
          city: city,
          state: this.retriveState(state),
          pinCode: pinCode,
        });
      }
    });
  }

  //map state with the selected text
  retriveState(str: string) {
    const selectedState = this.allStateData.filter((state) =>
      state.toLowerCase().includes(str.toLowerCase())
    );
    return selectedState[0];
  }

  onLocationChange() {
    this.deliveryForm.patchValue({
      deliveryLocation: '',
    });
  }

  geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const circle = new this.googleRef.Circle({
          center: geolocation,
          radius: position.coords.accuracy,
        });
        if (this.mapAutoComplete) {
          this.mapAutoComplete.setBounds(circle.getBounds());
        }
      });
    }
  }

  getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyDRTBC9avdK4NIULFqEQdTLVGMdCIoo8GQ&libraries=places';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google map SDK is not available!');
        }
      };
    });
  }

  get deliveryLocation() {
    return this.deliveryForm.get('deliveryLocation');
  }
  get deliveryType() {
    return this.deliveryForm.get('deliveryType');
  }
  get deliveryDay() {
    return this.deliveryForm.get('deliveryDay');
  }
  get deliveryTime() {
    return this.deliveryForm.get('deliveryTime');
  }
  get fullName() {
    return this.deliveryForm.get('fullName');
  }
  get address() {
    return this.deliveryForm.get('address');
  }
  get city() {
    return this.deliveryForm.get('city');
  }
  get state() {
    return this.deliveryForm.get('state');
  }
  get pinCode() {
    return this.deliveryForm.get('pinCode');
  }

  get f() {
    return this.deliveryForm.controls;
  }

  get today() {
    let date: Date = new Date();
    if (this.selectedDay == 'Tomorrow') {
      date.setDate(date.getDate() + 1);
    } else if (this.selectedDay == 'AfterTomorrow') {
      date.setDate(date.getDate() + 2);
    } else if (this.selectedDay == 'Overmorrow') {
      date.setDate(date.getDate() + 3);
    }
    return (
      date.getDate() +
      '/' +
      ('00' + (date.getMonth() + 1)).slice(-2) +
      '/' +
      date.getFullYear()
    );
  }
  get time() {
    let strTime: string = '',
      ampm: string = '';
    let hours: number = 0,
      minutes: number = 0;
    if (this.selectedTime == '') {
      let date: Date = new Date();
      hours = date.getHours();
      minutes = date.getMinutes();
      ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      strTime =
        hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
    } else {
      let arr = this.selectedTime.split(':');
      ampm = Number(arr[0]) >= 12 ? 'pm' : 'am';
      minutes = Number(arr[1]);
      hours = Number(arr[0]) % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      strTime =
        hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
    }
    return strTime;
  }

  get userName() {
    if (this.authService.userValue) {
      let tokenDet: any = this.authService.userValue;
      return tokenDet.user.firstname;
    }
    return '';
  }

  onDeliveryFormValueChanges() {
    this.deliveryDay!.valueChanges.subscribe((value) => {
      this.selectedDay = value;
      // console.log('Value changes : ' + this.selectedDay);
      this.deliveryTime?.updateValueAndValidity();
    });
    this.deliveryTime!.valueChanges.subscribe((value) => {
      this.selectedTime = value;
    });
    this.deliveryType!.valueChanges.subscribe((value) => {
      this.isScheduleNowSelected = value == 'now' ? true : false;
      if (this.isScheduleNowSelected) {
        this.deliveryDay?.setValue('Today');
        // let currHour : string = this.getCurrHour();
        // this.deliveryTime?.setValue(currHour);
      }
    });
  }

  isTimeValid(): ValidatorFn {
    return (control: AbstractControl): { [Key: string]: string } | null => {
      let selectedTime = control.value.split(':');
      let hr = Number(selectedTime[0]);
      let min = Number(selectedTime[1]);
      let currHr = new Date().getHours();
      let currMin = new Date().getMinutes();
      if (this.deliveryDay?.value == 'Today') {
        if (hr > currHr || (hr == currHr && min > currMin)) {
          return null;
        } else {
          return { PastTime: control.value };
        }
      }
      return null;
    };
  }

  expandOrderSummary() {
    this.displayOrderSummary = this.displayOrderSummary == false ? true : false;
  }

  getCurrHour() {
    let currHour: number = new Date().getHours();
    let currMinute: number = new Date().getMinutes();
    let currHourMins: string = '';
    if (currHour <= 8 || (currHour == 9 && currMinute < 30)) {
      if (currMinute < 30) {
        currMinute = 30;
      } else {
        currMinute = 0;
        currHour += 1;
      }
      if (currHour >= 8) {
        currHourMins =
          ('00' + currHour).slice(-2) + '.' + ('00' + currMinute).slice(-2);
      } else {
        currHourMins = '08.00';
      }
    } else if (
      (currHour >= 9 && currHour <= 12) ||
      (currHour == 13 && currMinute < 30)
    ) {
      if (currMinute < 30) {
        currMinute = 30;
      } else {
        currMinute = 0;
        currHour += 1;
      }
      if (currHour >= 12) {
        currHourMins =
          ('00' + currHour).slice(-2) + '.' + ('00' + currMinute).slice(-2);
      } else {
        currHourMins = '12.00';
      }
    } else if (
      (currHour >= 13 && currHour <= 20) ||
      (currHour == 21 && currMinute < 30)
    ) {
      if (currMinute < 30) {
        currMinute = 30;
      } else {
        currMinute = 0;
        currHour += 1;
      }
      if (currHour >= 20) {
        currHourMins =
          ('00' + currHour).slice(-2) + '.' + ('00' + currMinute).slice(-2);
      } else {
        currHourMins = '20.00';
      }
    } else {
      this.deliveryForm.get('deliveryDay')?.setValue('Tomorrow');
      currHourMins = '08.00';
    }
    return currHourMins;
  }

  onSubmit() {
    this.submitted = true;

    if (this.deliveryForm.invalid) {
      Object.keys(this.deliveryForm.controls).forEach((key) => {
        this.deliveryForm.get(key)?.markAsDirty();
      });
    } 
    else if(!this.IsValidDelivery)
    {
      this.toastr.error('The delivery is not valid');
    }
    else {
      this.cartService
        .placeCustomerOrder(this.deliveryForm.value, this.userCart, this.total,this.deliveryQuote)
        .subscribe(
          (resp: any) => {
            // console.log(resp);
            this.razorPayCheckout(resp);
          },
          (err: any) => {
            this.toastr.error(
              'The order wasnt confirmed.Please retry',
              'Error!!'
            );
          }
        );
    }
  }

  loadUserCart() {
    sessionStorage.setItem('fromSession', JSON.stringify(false));
    this.cartService.getProductsInUserCart().subscribe((response: any) => {
      // console.log(JSON.stringify(response));
      if (response == null || response == undefined || response.length == 0) {
        this.userCart = [];
        this.calculateTotal();
        //this.toastr.success('Cart is Empty',"Success!!");
      } else {
        for (let item of response) {
          item.details = JSON.parse(item.details);
          if (item.details && item.details.length > 0) {
            for (let product of item.details) {
              let currItem: Item = {
                ItemImageUrl: product.imgUrl,
                ItemName: product.Name,
                ItemQuantity: Number(product.quantity),
                ItemPrice: Number(product.Price),
                ItemUpdated: false,
                ItemCartId: item.cartId,
                ItemItemId: product.itemId,
                ItemVendorId: product.vendorId,
                ItemUserId: item.userUserId,
              };
              this.userCart.push(currItem);
            }
          }
        }
        this.calculateTotal();
        this.getDeliveryCost();
      }
    });
  }

  loadAddressDetails() {
    this.profileService.getAllStateDetails().subscribe((data: any) => {
      if (data != null && data != undefined) {
        data.forEach((element: string) => {
          this.allStateData.push(element);
        });
      }
    });
    this.profileService.getAddressDetails().subscribe(
      (resp: any) => {
        // /console.log(resp);
        if (resp.length) {
          this.deliveryForm.patchValue({
            deliveryType: 'now',
            fullName: this.userName,
            address: resp[0].address,
            city: resp[0].city,
            state: resp[0].state,
            pinCode: resp[0].zip,
          });
          //after loading address validate the form
          Object.keys(this.deliveryForm.controls).forEach((key) => {
            this.deliveryForm.get(key)?.markAsDirty();
          });
        }
      },
      (err) => console.log(err)
    );
  }

  calculateTotal() {
    this.subTotal = 0;
    for (let prod of this.userCart) {
      this.subTotal += prod.ItemQuantity * prod.ItemPrice;
    }
    // this.discount = this.checkDiscount();
    this.subTotalWthDiscount = this.subTotal - this.discount;
    this.total = this.subTotalWthDiscount + this.deliveryCost;
  }

  checkDiscount(): number {
    return 0;
  }

  getDeliveryCost() {
    if(this.userCart && this.userCart[0].ItemVendorId)
    {
      this.deliveryCost = 0;
      this.total = this.subTotalWthDiscount + this.deliveryCost;
      this.deliveryQuote = {} as any;
      this.IsValidDelivery = false;
      this.deliveryService.GetDeliveryCharges(this.userCart[0].ItemVendorId).subscribe((resp:any)=>{
        this.deliveryCost = resp.price;
        this.total = this.subTotalWthDiscount + this.deliveryCost;
        this.IsValidDelivery = true;
        this.deliveryQuote = {
          partner: resp.partner,
          cost: resp.price,
          location : resp.location
        }
      },(err : any)=>{
        // console.log(err);
        this.IsValidDelivery = false;
        this.toastr.error(err.error.message,'Error!!');
      })
    }
  }

  incProdQuantity(cartId: string, itemId: string, quantity: number) {
    for (let item of this.userCart) {
      if (item.ItemCartId == cartId && item.ItemItemId == itemId) {
        item.ItemQuantity += 1;
        item.ItemUpdated = true;
        this.calculateTotal();
      }
    }
  }

  decProdQuantity(cartId: string, itemId: string, quantity: number) {
    for (let item of this.userCart) {
      if (
        item.ItemCartId == cartId &&
        item.ItemItemId == itemId &&
        item.ItemQuantity > 1
      ) {
        item.ItemQuantity -= 1;
        item.ItemUpdated = true;
        this.calculateTotal();
      }
    }
  }

  razorPayCheckout(resp: any) {
    let options = this.cartService.getRazorPaymentData(
      this.userCart,
      this.total,
      resp.data.rzPayOrderId,
      resp.data.orderId
    );
    options.handler = (response: any, error: any) => {
      options.response = response;
      // console.log(response);
      // console.log(options);
      this.verifyAndConfirmPayment(response, resp);
    };
    options.modal.ondismiss = () => {
      // handle the case when user closes the form while transaction is in progress
      // this.cartService.checkCancelledPaymentStatus().subscribe((data:any)=>{
      //   console.log(data);
      // })
      // console.log('Transaction cancelled.');
    };

    this.invokeRazorPay(options, resp);
  }

  invokeRazorPay(options: any, resp: any) {
    this.razorPay = new this.windowRef.NativeWindow.Razorpay(options);
    this.razorPay.open();

    this.razorPay.on('payment.failed', (response: any) => {
      // console.log(response.error.code);
      // console.log(response.error.description);
      // console.log(response.error.source);
      // console.log(response.error.step);
      // console.log(response.error.reason);
      // console.log(response.error.metadata.order_id);
      // console.log(response.error.metadata.payment_id);
      this.cartService
        .logErrorPayment(
          response.error.metadata.order_id,
          response.error.metadata.payment_id,
          resp.data.orderId,
          response.error
        )
        .subscribe((data: any) => {
          // console.log('error payment logged');
        });
    });
  }

  verifyAndConfirmPayment(response: any, resp: any) {
    // verify payment signature & capture transaction
    this.cartService
      .verifyAndCapturePayment(response, resp.data.orderId)
      .subscribe(
        (data: any) => {
          //create Invoice
          let invoiceData = {
            amount: this.total,
            invoice_date: new Date(),
            orderId: resp.data.orderId,
            VendorVendorId: this.userCart[0].ItemVendorId,
          };
          this.cartService.createInvoice(invoiceData).subscribe(
            (invResp: any) => {
              this.router.navigate(['/', 'cart', 'confirm', resp.data.orderId]);
            },
            (err: any) => {
              handleError(err);
            }
          );
        },
        (err: any) => {
          this.toastr.error(
            'The order wasnt confirmed. Your payment will be refunded',
            'Error!!'
          );
        }
      );
  }

  validateDeliveryLocation(): ValidatorFn {
    return (control: AbstractControl): { [Key: string]: string } | null => {
      let city = control.value;
      if(this.locationService.CurrentCity != city)
      {
        return { location: city };
      }
      return null;
    };
  }

  validateAndGetDeliveryCharges()
  {
    if(this.city?.valid)
    {
      this.getDeliveryCost();
    }
    else
    {
      this.IsValidDelivery = false;
    }
  }
}
