/**
 * This component drives the administrator authentication.
 */
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'auth.component.html'
})
export class AuthComponent {
  public username = '';
  public password = '';

  constructor(private router: Router) {}

  // TODO: implement the actual authentication mechanism
  authenticate(form: NgForm): void {
    if (form.valid) {
      this.router.navigateByUrl('/admin/main');
    }
  }
}
