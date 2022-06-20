import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserI } from 'loc8r-common/common.module';
import { AuthService } from '../misc/auth.service';
import { FrontendError } from '../misc/error';
import { FormErrors } from '../misc/form-errors';
import { ReporterData, ReporterService } from '../misc/reporter.service';
import { PageHeader } from './page-header.component';

@Component({
  selector: 'app-signin-page',
  templateUrl: 'signin.component.html'
})
export class SignInComponent extends FormErrors {
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

  constructor(private auth: AuthService,
              private reporter: ReporterService,
              private router: Router) {
    super();
  }

  submit(form: NgForm) {
    if (form.valid) {
      this.auth.login(this.user)
        .subscribe(
          () => {
            // User has been logged in, redirect them to the homepage
            // @todo Redirecting users to homepage upon login is not best
            // UX. They need to be redirected to the page they were at
            // before the login page (and ignoring the create profile
            // page). Introduce a service that holds history of visited
            // routes (RouteHistoryService) that can be used to obtain
            // the last last visited route including filtering out speficic
            // routes (e.g. last visited route ignoring /signup and /signin).
            this.router.navigateByUrl('/')
              .catch(() => {
                this.reporter.sendMessage(new ReporterData(
                  'An unexpected error has occurred.',
                  true
                ));
              });
          },
          err => {
            if (err instanceof FrontendError) {
              this.reporter.sendMessage(new ReporterData(err.message, true));
            }
            else {
              this.reporter.sendMessage(new ReporterData(
                'Failed to create the user profile due to an error. Please try again.',
                true
              ));
            }
          });
    }
  }
}
