import { Component } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isRecord, ReviewI } from 'loc8r-common/common.module';
import { ReviewRepository } from '../dal/review.repository';
import { FrontendError } from '../misc/error';
import { ReporterData, ReporterService } from '../misc/reporter.service';
import { PageHeader } from './page-header.component';

@Component({
  selector: 'app-add-review',
  templateUrl: 'add-review.component.html'
})
export class AddReviewComponent {
  public review: ReviewI = {
    _id: '',
    createdOn: '',
    rating: 1,
    reviewer: '',
    text: ''
  };

  private locationId = '';
  public locationName = '';
  public pageHdr: PageHeader = { title: '' };

  constructor(private reviewRepo: ReviewRepository,
              private router: Router,
              private reporter: ReporterService,
              activatedRoute: ActivatedRoute) {
    if (typeof activatedRoute.snapshot.params.locationid !== 'string') {
      console.error('Cannot create AddReviewComponent because `locationid` parameter is missing.');
      this.router.navigateByUrl('/locations')
        .catch(reason => {
          // @todo What can we do?
          console.error(reason);
        });
    }
    else if (typeof activatedRoute.snapshot.queryParams.name !== 'string') {
      console.error('Cannot activate AddReviewComponent because `name` query parameter is missing.');
      this.router.navigateByUrl('/locations')
        .catch(reason => {
          // @todo What can we do?
          console.error(reason);
        });
    }
    else {
      this.locationName = activatedRoute.snapshot.queryParams.name;
      this.locationId = activatedRoute.snapshot.params.locationid;
      this.pageHdr.title = `Review ${this.locationName}`;
    }
  }

  public getFormControValidationMsg(ctrl: NgModel, fieldName = ''): string | undefined {
    if (ctrl.invalid && ctrl.errors) {
      if (fieldName === '' && ctrl.path.length > 0) {
        fieldName = ctrl.path[ctrl.path.length - 1];
      }

      for (const prop in ctrl.errors) {
        switch (prop) {
          case 'required': {
            return `${fieldName} must be provided.`;
          }
          case 'minlength': {
            const minLength = ctrl.errors.minlength as unknown;
            if (isRecord(minLength) && (typeof minLength.requiredLength === 'string' || typeof minLength.requiredLength === 'number')) {
              return `${fieldName} must be at least ${minLength.requiredLength} characters.`;
            }
            break;
          }
          case 'maxlength': {
            const maxLength = ctrl.errors.maxlength as unknown;
            if (isRecord(maxLength) && (typeof maxLength.requiredLength === 'string' || typeof maxLength.requiredLength === 'number')) {
              return `${fieldName} must not be at longer than ${maxLength.requiredLength} characters.`;
            }
            break;
          }
          case 'patter': {
            return `${fieldName} contains invalid characters.`;
          }
          default: {
            console.warn(`${prop} validator property is not handled.`);
            return `${fieldName} field value is invalid.`;
          }
        }
      }
    }
    return undefined;
  }

  public submit(form: NgForm) {
    if (form.valid) {
      this.reviewRepo.createReview(this.locationId, this.review)
        .subscribe(() => {
          form.resetForm();
          this.reporter.sendMessage(new ReporterData(
            'You have added a new review.',
            false,
            { timeoutMs: 3000 }
          ));
          this.router.navigateByUrl(`/locations/${this.locationId}`)
            .catch(reason => {
              // @todo What can we do?
              console.error(reason);
            });
        },
        err => {
          if (err instanceof FrontendError) {
            this.reporter.sendMessage(new ReporterData(err.message, true));
          }
          else {
            this.reporter.sendMessage(new ReporterData(
              'Review could not be added due to an error. Please try again.',
              true
            ));
          }
        });
    }
  }
}
