/**
 * The Product model.
 */
export class ProductModel {
  constructor(
    public id?: number,
    public name = "",
    public category = "",
    public price = 0.0) {
  }

  static compare(p1: ProductModel, p2: ProductModel): boolean {
    return p1.id === p2.id &&
      p1.name === p2.name &&
      p1.category === p2.category &&
      p1.price === p2.price;
  }
}
