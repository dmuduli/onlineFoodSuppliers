import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../shared/services/contact.service';
import { handleError } from '../shared/helpers/error-handler';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService,
      private contactService: ContactService) {
        this.contactForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      Name: ['',Validators.required],
      Email: ['',Validators.required],
      Message: ['',Validators.required],
      isHumanVal : ''
    });
  }

  get formControls()
  {
    return this.contactForm.controls;
  }

  onSubmit()
  {
    // console.log(this.isHumanVal);
    if(this.formControls.isHumanVal.value != '4')
    {
      this.toastr.error('You are not human','Error!!');
      return;
    }
    if (this.contactForm.invalid) {
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });
    } else {
      let data = {
        name: this.formControls.Name.value,
        email: this.formControls.Email.value,
        message: this.formControls.Message.value
      };
      this.contactService.postContactData(data).subscribe((data:any)=>{
        this.contactForm.reset();
        this.toastr.success('Thanks for your Feedback','success!!');
      },
      (err:any)=>{
        handleError(err);
      });
    }
  }

}
