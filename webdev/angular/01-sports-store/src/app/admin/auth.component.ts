/**
 * This component drives the administrator authentication.
 */
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../model/auth.service';
import { ConnectivityService } from '../model/connectivity.service';

@Component({
  templateUrl: 'auth.component.html'
})
export class AuthComponent {
  public username = '';
  public password = '';
  public authFailed = false;

  constructor(private router: Router, private authService: AuthService, public connService: ConnectivityService) {}

  authenticate(form: NgForm): void {
    this.authFailed = false;
    if (form.valid) {
      this.authService.authenticate(this.username, this.password).subscribe(success => {
        if (success) {
          this.router.navigateByUrl('/admin/main');
          this.authFailed = false;
        }
        else {
          this.authFailed = true;
        }
      });
    }
  }
}
