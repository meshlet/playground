/**
 * A service that keeps track of whether the user is creating a new
 * product or editing an existing one.
 */
import { Injectable } from "@angular/core";
import { ProductModel } from "../model/product.model";

export enum MODE {
  CREATE,
  EDIT
};

@Injectable()
export class TrackModeService {
  mode = MODE.EDIT;
  product: ProductModel | undefined;
}
