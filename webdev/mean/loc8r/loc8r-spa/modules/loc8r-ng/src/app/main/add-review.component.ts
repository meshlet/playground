import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ReviewI } from 'loc8r-common/common.module';
import { ReviewRepository } from '../dal/review.repository';
import { ErrorCode, FrontendError } from '../misc/error';
import { FormErrors } from '../misc/form-errors';

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
export class AddReviewComponent extends FormErrors {
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

  constructor(private reviewRepo: ReviewRepository) {
    super();
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
