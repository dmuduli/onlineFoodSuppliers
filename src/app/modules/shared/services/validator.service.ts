import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  isValidPhoneNo() : ValidatorFn{
    return (control : AbstractControl) : {[key:string]: string} | null =>{
      let phoneNo = control.value;
      if(phoneNo.toString().length == 10)
      {
        return null;
      }
      else
      {
        return {exceedsLength : phoneNo};
      }
    };
  }

  isNumericPhoneNo() : ValidatorFn{
    return (control : AbstractControl) : {[key:string]: string} | null =>{
      let phoneNo = control.value;
      let pattern = /^\d+$/;
      if(pattern.test(phoneNo))
      {
        return null;
      }
      else
      {
        return {IsNotNumeric : phoneNo};
      }
    };
  }

  isValidEmail() : ValidatorFn{
    return (control : AbstractControl) : {[key:string]: string} | null =>{
      let email = control.value;
      let pattern = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if(pattern.test(email))
      {
        return null;
      }
      else
      {
        return {InvalidEmail : email};
      }
    }
  }
}
