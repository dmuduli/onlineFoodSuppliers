import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ValidatorService } from '../shared/services/validator.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../shared/services/cart.service';
import { LocationService } from '../shared/services/location.service'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  uname: string | null;
  pwd: string | null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private validator: ValidatorService,
    private toastr: ToastrService,
    private cartService: CartService,
    private locationService : LocationService
  ) {
    this.submitted = false;
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, this.validator.isValidEmail()]],
      password: ['', Validators.required],
      rememberMe: [''],
    });

    this.uname = localStorage.getItem('username');
    this.pwd = localStorage.getItem('password');

    if (this.uname && this.pwd) {
      this.form.patchValue({
        email: this.uname,
        password: this.pwd,
        rememberMe: true,
      });
    }
  }

  ngOnInit(): void {
    this.authService.setHeaderDisplayStatus(true);
    this.locationService.getCurrentLocationLatLong();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    const isFromSession: any = JSON.parse(
      sessionStorage.getItem('fromSession') as any
    );
    // stop here if form is invalid
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsDirty();
      });
      return;
    }

    if (!this.uname && !this.pwd) {
      this.authService
        .login(this.f.email.value, this.f.password.value)
        .subscribe(
          (response: any) => {
            if (this.f.rememberMe.value) {
              localStorage.setItem('username', this.f.email.value);
              localStorage.setItem('password', this.f.password.value);
            }

            this.toastr.success('Login is successful', 'Success!');
            // get return url from query parameters or default to home page
            if (isFromSession) {
              const cartData = JSON.parse(
                sessionStorage.getItem('cartData') as any
              );

              if (cartData && cartData.length) {
                this.cartService.addGuestCart(cartData).subscribe(
                  (result) => {
                    this.router.navigate(['/', 'cart', 'checkout']);
                    sessionStorage.setItem('cartData', JSON.stringify([]));
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              }
            } else {
              sessionStorage.setItem('signInFromHome', JSON.stringify(false));
              this.authService.setHeaderDisplayStatus(false);
              this.router.navigate(['/', 'home']);
            }
          },
          (error: any) => {
            // this.toasterService.error(handleError(error));
          }
        );
    } else {
      this.authService
        .login(
          this.f.email.value || this.uname,
          this.f.password.value || this.pwd
        )
        .subscribe(
          (response: any) => {
            if (this.f.rememberMe.value) {
              localStorage.setItem('username', this.f.email.value);
              localStorage.setItem('password', this.f.password.value);
            }
            this.toastr.success('Login is successful', 'Success!');
            // get return url from query parameters or default to home page
            if (isFromSession) {
              const cartData = JSON.parse(
                sessionStorage.getItem('cartData') as any
              );

              if (cartData && cartData.length) {
                this.cartService.addGuestCart(cartData).subscribe(
                  (result) => {
                    this.router.navigate(['/', 'cart', 'checkout']);
                    sessionStorage.setItem('cartData', JSON.stringify([]));
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              }
            } else {
              sessionStorage.setItem('signInFromHome', JSON.stringify(false));
              this.authService.setHeaderDisplayStatus(false);
              this.router.navigate(['/', 'home']);
            }
          },
          (error: any) => {
            // this.toasterService.error(handleError(error));
          }
        );
    }
  }

  ngOnDestroy()
  {
    this.authService.setHeaderDisplayStatus(false);
  }
}
