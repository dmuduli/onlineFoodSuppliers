import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss']
})
export class SignoutComponent implements OnInit {

  constructor(private router: Router,private authService : AuthService) { }

  ngOnInit(): void {
    sessionStorage.setItem('signInFromHome', JSON.stringify(true));
    this.authService.logout();
  }

}
