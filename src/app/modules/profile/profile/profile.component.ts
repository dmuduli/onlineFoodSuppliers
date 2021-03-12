import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { handleError } from '../../shared/helpers/error-handler';
import { AuthService } from '../../shared/services/auth.service';

import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userName: string;
  isHideMenu: boolean;
  statusSubscription: any;
  profile: any;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthService
  ) {
    this.userName = '';
    this.isHideMenu = false;
    this.statusSubscription = this.profileService.hideMenuStatusChange.subscribe(
      (val) => {
        this.isHideMenu = val;
      }
    );
    this.profile = {};
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.profileService.getPersonalDetails(userId).subscribe(
      (result: any) => {
        this.profile = result;
        this.userName = result.firstname;
      },
      (err) => {
        //console.log(err);
        handleError(err);
      }
    );
  }

  // navigateAddrBook(): boolean
  // {
  //   this.router.navigateByUrl('/profile/addressbook');
  //   return false;
  // }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe();
  }
}
