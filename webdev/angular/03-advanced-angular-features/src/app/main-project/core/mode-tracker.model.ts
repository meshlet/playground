/**
 * A class that keeps track of whether the user is creating a new
 * product or editing an existing one.
 *
 * @note This class is used together with Observer and Observable RxJS classes
 * to propagate the changes between different parts of the application, namely
 * the ProductTableComponent (see product-table.component.ts) and the
 * ProductFormComponent (see product-form.component.ts).
 */
import { InjectionToken } from "@angular/core";

export enum MODE {
  CREATE,
  EDIT
};

export class ModeTrackerModel {
  constructor(public mode = MODE.EDIT, public id?: number) {
  }
}

export const MODE_TRACKER_TOKEN = new InjectionToken("mode tracker");
