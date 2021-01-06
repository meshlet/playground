/**
 * The product model class.
 */
export class Product {
  public readonly id?: number;
  public name: string;
  public category: string;
  public description: string;
  public price: number;

  constructor(
    id?: number | undefined,
    name: string = '',
    category: string = '',
    description: string = '',
    price: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.price = price;
  }
}
