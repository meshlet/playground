import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { isRecord, ReviewI } from 'loc8r-common/common.module';
import { ReviewRepository } from '../dal/review.repository';
import { ErrorCode, FrontendError } from '../misc/error';

/**
 * A component that encapsulates the functionality of adding
 * a new review.
 *
 * @note Component is encapsulated with output properties used
 * to signal different events (e.g. new review created). As such,
 * the components needs to be integrated in the page by a higher-
 * level parent component.
 */
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

  /**
   * A location ID used by component when creating reviews.
   */
  @Input()
  locationId = '';

  /**
   * Output property used to signal to subscribers that new
   * review has been created.
   */
  @Output()
  onReviewCreated = new EventEmitter<ReviewI>();

  /**
   * Output property used to signal to subscribers that user
   * has pressed the Cancel button.
   */
  @Output()
  onCancel = new EventEmitter<void>();

  /**
   * Output property used to signal to subscribers that new
   * review couldn't be created due to an error.
   */
  @Output()
  onError = new EventEmitter<FrontendError>();

  constructor(private reviewRepo: ReviewRepository) {}

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
          case 'pattern': {
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

  resetReview() {
    this.review = {
      _id: '',
      createdOn: '',
      rating: 1,
      reviewer: '',
      text: ''
    };
  }

  public submit(form: NgForm) {
    if (form.valid) {
      this.reviewRepo.createReview(this.locationId, this.review)
        .subscribe(createdReview => {
          form.resetForm();
          this.resetReview();
          this.onReviewCreated.emit(createdReview);
        },
        err => {
          if (err instanceof FrontendError) {
            this.onError.emit(err);
          }
          else {
            this.onError.emit(new FrontendError(
              ErrorCode.InternalServerError,
              'Review could not be added due to an error. Please try again.'));
          }
        });
    }
  }
}
