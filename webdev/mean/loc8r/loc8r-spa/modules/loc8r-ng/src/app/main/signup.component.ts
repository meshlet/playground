import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserI } from 'loc8r-common/common.module';
import { UserRepository } from '../dal/user.repository';
import { FrontendError } from '../misc/error';
import { FormErrors } from '../misc/form-errors';
import { ReporterData, ReporterService } from '../misc/reporter.service';
import { PageHeader } from './page-header.component';

@Component({
  selector: 'app-signup-page',
  templateUrl: 'signup.component.html'
})
export class SignUpComponent extends FormErrors {
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

  constructor(private userRepo: UserRepository,
             private router: Router,
             private reporter: ReporterService) {
    super();
  }

  /** Bound to the 'confirm password' form control */
  public password2 = '';

  submit(form: NgForm) {
    if (form.valid) {
      this.userRepo.createUser(this.user)
        .subscribe(
          () => {
            // Let the user know they have successfully created a new profile
            // and redirect them to the login page
            // @todo Having to log in after creating a profile could be considered
            // bad UX. Change this so that creating the profile automatically logs
            // the user in.
            this.reporter.sendMessage(new ReporterData(
              'Your profile has been successfully created.'
            ));
            this.router.navigateByUrl('/signin')
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
