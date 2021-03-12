import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { ValidatorService } from 'src/app/modules/shared/services/validator.service';
import { AngularMaterialModule } from './modules/shared/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationInterceptor } from './modules/shared/services/location-header-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    CommonModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 500,
    }), // ToastrModule added
  ],
  providers: [ValidatorService, {
    provide : HTTP_INTERCEPTORS, useClass : LocationInterceptor, multi :true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
