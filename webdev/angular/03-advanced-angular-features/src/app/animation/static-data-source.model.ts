import { ProductModel } from "./product.model";
import {Observable, of, throwError} from "rxjs";

export class StaticDataSourceModel {
  private readonly data: ProductModel[];
  private nextProductId = 1;

  constructor() {
    this.data = [
      { id: 1, name: "Soccer Ball", category: "Soccer", price: 19.50 },
      { id: 2, name: "Corner Flags", category: "Soccer", price: 34.95 },
      { id: 3, name: "Stadium", category: "Soccer", price: 79500 },
      { id: 4, name: "Thinking Cap", category: "Chess", price: 16 },
      { id: 5, name: "Unsteady Chair", category: "Chess", price: 29.95 },
      { id: 6, name: "Human Chess Board", category: "Chess", price: 75 }
      ]
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
      Object.assign(this.data[index], product);
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
