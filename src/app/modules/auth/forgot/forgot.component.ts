import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {
  constructor(private authService: AuthService) {
    this.authService.setHeaderDisplayStatus(true);
  }

  ngOnInit(): void {
    this.authService.setHeaderDisplayStatus(true);
  }

  ngOnDestroy(){
    this.authService.setHeaderDisplayStatus(false);
  }
}
