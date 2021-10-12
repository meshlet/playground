import { Injectable } from "@angular/core";
import { ProductModel } from "./product.model";
import { DataSourceInterfaceModel } from "./data-source-interface.model";
import {Observable, of, throwError} from "rxjs";

@Injectable()
export class StaticDataSourceModel implements DataSourceInterfaceModel {
  private readonly data: ProductModel[];
  private nextProductId = 1;

  constructor() {
    this.data = [
      new ProductModel(this.nextProductId++, "Kayak", "Watersports", 275),
      new ProductModel(this.nextProductId++, "Lifejacket", "Watersports", 48.95),
      new ProductModel(this.nextProductId++, "Soccer Ball", "Soccer", 19.50),
      new ProductModel(this.nextProductId++, "Corner Flags", "Soccer", 34.95),
      new ProductModel(this.nextProductId++, "Thinking Cap", "Chess", 16)];
  }

  getData(): Observable<ProductModel[]> {
    return of(this.data);
  }

  saveProduct(product: ProductModel): Observable<ProductModel> {
    // Generate a unique ID for the new product and return a resolved
    // Observable with the same product instance. The collection
    // management is done by the RepositoryModel class.
    product.id = this.nextProductId++;
    return of(product);
  }

  updateProduct(product: ProductModel): Observable<ProductModel> {
    // Find the product and return a resolved Observable with it or
    // a failed Observable in case product with given ID doesn't exist.
    // The slicing of the ProductModel into the local collection is done
    // by the RepositoryModel class.
    let index = this.data.findIndex((p: ProductModel) => p.id === product.id);
    if (index > -1) {
      return of(this.data[index]);
    }
    else {
      return throwError(`Product with ID (${product.id}) not found`);
    }
  }

  deleteProduct(id: number): Observable<ProductModel> {
    // Find the product and return a resolved Observable with it or
    // a failed Observable in case product with given ID doesn't exist.
    // The slicing of the ProductModel into the local collection is done
    // by the RepositoryModel class.
    let index = this.data.findIndex((p: ProductModel) => p.id === id);
    if (index > -1) {
      return of(this.data[index]);
    }
    else {
      return throwError(`Product with ID (${id}) not found`);
    }
  }
}
