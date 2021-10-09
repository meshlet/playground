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
}
