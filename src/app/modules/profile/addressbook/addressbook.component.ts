import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProfileService } from '../../shared/services/profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addressbook',
  templateUrl: './addressbook.component.html',
  styleUrls: ['./addressbook.component.scss'],
})
export class AddressbookComponent implements OnInit {
  addressData: any;
  addressForm: FormGroup;
  displayAdrForm: boolean;
  isNewAddress: boolean;
  currentAddresId: string;
  allStateData : string[];

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toaster: ToastrService
  ) {
    this.profileService.setMobileMenuDisplayStatus(true);
    this.addressForm = new FormGroup({});
    this.displayAdrForm = false;
    this.isNewAddress = false;
    this.currentAddresId = '';
    this.allStateData = [];
  }

  ngOnInit(): void {
    this.loadAddressDetails();
    this.addressForm = this.formBuilder.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
    });
  }

  get fullName() {
    return this.addressForm.get('fullName');
  }
  get address() {
    return this.addressForm.get('address');
  }
  get city() {
    return this.addressForm.get('city');
  }
  get state() {
    return this.addressForm.get('state');
  }
  get pinCode() {
    return this.addressForm.get('zip');
  }

  loadAddressDetails() {
    this.profileService.getAddressDetails().subscribe(
      (data) => (this.addressData = data),
      (err) => console.log(err)
    );
    this.profileService.getAllStateDetails().subscribe((data : any)=>{
      if(data!=null && data != undefined)
      {
        data.forEach((element : string) => {
          this.allStateData.push(element);
        });
      }
     
    });
  }

  addInAddrForm() {
    this.displayAdrForm = true;
    this.isNewAddress = true;
    return false;
  }

  editAddrForm(addresId: any) {
    this.currentAddresId = addresId;
    for (let addr of this.addressData) {
      if (addr.Id == addresId) {
        this.addressForm.patchValue({
          address: addr.address,
          city: addr.city,
          state: addr.state,
          zip: addr.zip,
        });
      }
    }
    this.displayAdrForm = true;
    this.isNewAddress = false;
  }

  addUpdateAddress() {
    if (this.addressForm.invalid) {
      Object.keys(this.addressForm.controls).forEach((key) => {
        this.addressForm.get(key)?.markAsDirty();
      });
    } else {
      if (this.isNewAddress) {
        this.profileService.addProfileAddress(this.addressForm.value).subscribe(
          (data) => {
            this.resetForm();
          },
          (error) => {
            if (error.status === 200) {
              this.resetForm();
            }
          }
        );
      } else {
        const payload = this.addressForm.value;
        payload['Id'] = this.currentAddresId;

        this.profileService
          .updateProfileAddress(this.addressForm.value)
          .subscribe(
            (data) => {
              this.resetForm();
            },
            (error) => {
              if (error.status === 200) {
                this.resetForm();
              }
            }
          );
      }
    }
  }

  resetForm() {
    this.displayAdrForm = false;
    this.addressForm.reset();
    this.loadAddressDetails();
    this.currentAddresId = '';
  }

  deleteAddress(addresId: any) {
    this.profileService.deleteProfileAddress(addresId).subscribe(
      (data) => {
        this.resetForm();
        this.toaster.success('Address deleted successfully');
      },
      (error) => {
        if (error.status === 200) {
          this.toaster.success('Address deleted successfully');
          this.resetForm();
        }
      }
    );
  }
}
