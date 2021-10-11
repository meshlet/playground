import { Injectable } from "@angular/core";
import { ProductModel } from "./product.model";
import { DataSourceInterfaceModel } from "./data-source-interface.model";
import {Observable, of} from "rxjs";

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
    // Nothing to do here. The splicing of the ProductModel is done by
    // the RepositoryModel class.
    return of(product);
  }

  deleteProduct(product: ProductModel): Observable<ProductModel> {
    // Nothing to do here. The splicing of the ProductModel is done by
    // the RepositoryModel class.
    return of(product);
  }
}
