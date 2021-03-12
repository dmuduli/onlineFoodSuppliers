import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor( private http: HttpClient) { }

  postContactData(data : any)
  {
    const options = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(`${environment.apiUrl}/contactUs`,data,{ headers: options});
  }
}
