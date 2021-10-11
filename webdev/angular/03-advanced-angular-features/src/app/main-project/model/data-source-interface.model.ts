import { InjectionToken } from "@angular/core";
import { ProductModel } from "./product.model";
import { Observable } from "rxjs";

/**
 * An injection token to be used when resolving data source services.
 */
export const DATA_SOURCE = new InjectionToken("data_source_token");

/**
 * Defines the interface that data source classes must implement.
 */
export interface DataSourceInterfaceModel {
  /**
   * Returns all products.
   */
  getData(): Observable<ProductModel[]>;

  /**
   * Create a new product.
   */
  saveProduct(product: ProductModel): Observable<ProductModel>;

  /**
   * Updates an existing product.
   */
  updateProduct(product: ProductModel): Observable<ProductModel>;

  /**
   * Deletes a product.
   */
  deleteProduct(product: ProductModel): Observable<ProductModel>;
}
