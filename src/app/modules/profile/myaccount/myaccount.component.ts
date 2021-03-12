import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../shared/services/profile.service'

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss']
})
export class MyaccountComponent implements OnInit {

  constructor(private profileService : ProfileService) { 
    this.profileService.setMobileMenuDisplayStatus(false);
  }

  ngOnInit(): void {
  }

}
