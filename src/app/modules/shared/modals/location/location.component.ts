import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {} from 'googlemaps';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  location: string;
  @ViewChild('deliveryLocation') deliveryInput: ElementRef | any;

  constructor(
    public dialogRef: MatDialogRef<LocationComponent>,
    @Inject(MAT_DIALOG_DATA) public projectData: any,
    private locationService : LocationService
  ) {
    this.location = '';
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    const geocoder = new google.maps.Geocoder();
    if (navigator.geolocation) {
      this.geocodeLatLng(geocoder);

      const options = {
        componentRestrictions: { country: 'IN' },
        fields: ['formatted_address', 'address_component', 'geometry', 'name'],
        location: this.locationService.CurrentLocation,
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
       
        // console.log(JSON.stringify(place));
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
              this.locationService.CurrentCity = city;
              console.log(city);
            } else if (
              addressType.indexOf('administrative_area_level_1') !== -1
            ) {
              state = component.long_name;
            } else if (addressType.indexOf('postal_code') !== -1) {
              pinCode = component.long_name;
            }
          }
        }
        if(place && place.geometry)
        {
          this.locationService.CurrentLocation = {
            lat : place.geometry.location.lat(),
            lng : place.geometry.location.lng()
          };
          // console.log(JSON.stringify( this.locationService.CurrentLocation));
        }
      });
    }
  }

  getCurrentLocation() {
    const geocoder = new google.maps.Geocoder();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.locationService.CurrentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        geocoder.geocode(
          { location: this.locationService.CurrentLocation },
          (
            results: google.maps.GeocoderResult[],
            status: google.maps.GeocoderStatus
          ) => {
            if (status === 'OK') {
              if (results[0]) {
                this.location = results[0].formatted_address;
                let address = '';
                let city = '';
                let state = '';
                let pinCode = '';

                for (const component of results[0].address_components) {
                  const addressType = component.types;
                  if (
                    addressType.indexOf('sublocality_level_2') !== -1 ||
                    addressType.indexOf('sublocality_level_1') !== -1
                  ) {
                    address = address
                      ? address + ', ' + component.long_name
                      : component.long_name;
                  } else if (addressType.indexOf('locality') !== -1) {
                    city = component.long_name;
                    this.locationService.CurrentCity = city;
                  } else if (
                    addressType.indexOf('administrative_area_level_1') !== -1
                  ) {
                    state = component.long_name;
                  } else if (addressType.indexOf('postal_code') !== -1) {
                    pinCode = component.long_name;
                  }
                }
              } else {
                console.log('No results found');
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
            }
          }
        );
      });
    }
  }

  geocodeLatLng(geocoder: google.maps.Geocoder) {
    geocoder.geocode(
      { location: this.locationService.CurrentLocation },
      (
        results: google.maps.GeocoderResult[],
        status: google.maps.GeocoderStatus
      ) => {
        if (status === 'OK') {
          if (results[0]) {
            this.location = results[0].formatted_address;
            let address = '';
            let city = '';
            let state = '';
            let pinCode = '';

            for (const component of results[0].address_components) {
              const addressType = component.types;
              if (
                addressType.indexOf('sublocality_level_2') !== -1 ||
                addressType.indexOf('sublocality_level_1') !== -1
              ) {
                address = address
                  ? address + ', ' + component.long_name
                  : component.long_name;
              } else if (addressType.indexOf('locality') !== -1) {
                city = component.long_name;
                this.locationService.CurrentCity = city;
              } else if (
                addressType.indexOf('administrative_area_level_1') !== -1
              ) {
                state = component.long_name;
              } else if (addressType.indexOf('postal_code') !== -1) {
                pinCode = component.long_name;
              }
            }
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    }
  }
}
