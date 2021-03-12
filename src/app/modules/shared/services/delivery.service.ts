import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient) { }

  GetDeliveryCharges(vendorId : any)
  {
    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(`${environment.apiUrl}/deliverycharges/`,{vendorId},{headers : options});
  }
}
