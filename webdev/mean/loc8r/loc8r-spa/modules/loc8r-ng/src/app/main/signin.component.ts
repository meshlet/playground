import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserI } from 'loc8r-common/common.module';
import { PageHeader } from './page-header.component';

@Component({
  selector: 'app-signin-page',
  templateUrl: 'signin.component.html'
})
export class SignInComponent {
  public user: UserI = {
    _id: '',
    email: '',
    password: '',
    firstname: '',
    lastname: ''
  };

  public pageHdr: PageHeader = {
    title: 'Sign In'
  };

  submit(form: NgForm) {
    void form;
  }
}
