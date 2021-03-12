import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { LocationService } from '../../shared/services/location.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private validator: ValidatorService,
    private toastr: ToastrService,
    private locationService : LocationService
  ) {
    this.submitted = false;
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, this.validator.isValidEmail()]],
      mobile: ['', [Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.setHeaderDisplayStatus(true);
    this.locationService.getCurrentLocationLatLong();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }
  get name() {
    return this.form.get('name');
  }
  get email() {
    return this.form.get('email');
  }
  get mobile() {
    return this.form.get('mobile');
  }
  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsDirty();
      });
      return;
    }
    if (this.password!.value != this.confirmPassword!.value) {
      this.confirmPassword?.setErrors({ incorrect: true });
      return;
    }

    this.authService.register(this.form.value).subscribe(
      (response: any) => {
        this.toastr.success('Registration successful', 'Success!');
        this.router.navigateByUrl('/auth');
      },
      (error: any) => {}
    );
  }

  ngOnDestroy()
  {
    this.authService.setHeaderDisplayStatus(false);
  }
}
