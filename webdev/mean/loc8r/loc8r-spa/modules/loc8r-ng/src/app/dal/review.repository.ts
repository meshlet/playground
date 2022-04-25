import { Inject, Injectable } from '@angular/core';
import { GetOneReviewRspI, CreateReviewRspI, ReviewI } from 'loc8r-common/common.module';
import { Observable } from 'rxjs';
import { BaseDataSource, DATA_SOURCE_INJECT_TOKEN } from './base.datasource';

@Injectable()
export class ReviewRepository {
  constructor(@Inject(DATA_SOURCE_INJECT_TOKEN) private dataSource: BaseDataSource) {}

  getReview(locationid: string, reviewid: string): Observable<GetOneReviewRspI['review']> {
    return this.dataSource.getOneReview(locationid, reviewid);
  }

  createReview(locationid: string, review: ReviewI): Observable<CreateReviewRspI['review']> {
    return this.dataSource.createReview(locationid, review);
  }
}
