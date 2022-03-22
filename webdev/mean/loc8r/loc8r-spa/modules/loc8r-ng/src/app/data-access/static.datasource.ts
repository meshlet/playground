import { Injectable } from '@angular/core';
import { LocationI } from 'loc8r-common/common.module';

@Injectable()
export class StaticDataSource {
  private data: Array<LocationI> = [];

  getData() {
    return this.data;
  }
}
