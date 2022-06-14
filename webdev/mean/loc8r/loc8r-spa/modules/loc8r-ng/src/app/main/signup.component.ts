import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserI } from 'loc8r-common/common.module';
import { PageHeader } from './page-header.component';

@Component({
  selector: 'app-signup-page',
  templateUrl: 'signup.component.html'
})
export class SignUpComponent {
  public user: UserI = {
    _id: '',
    email: '',
    password: '',
    firstname: '',
    lastname: ''
  };

  public pageHdr: PageHeader = {
    title: 'Sign Up'
  };

  /** Bound to the 'confirm password' form control */
  public password2 = '';

  submit(form: NgForm) {
    void form;
  }
}
