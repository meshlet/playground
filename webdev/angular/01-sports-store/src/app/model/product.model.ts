/**
 * The product model class.
 */
export class Product {
  private readonly id?: number;
  private name: string;
  private category: string;
  private description: string;
  private price: number;

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

  get Id(): number | undefined {
    return this.id;
  }

  get Name(): string {
    return this.name;
  }

  set Name(name: string) {
    this.name = name;
  }

  get Category(): string {
    return this.category;
  }

  set Category(category: string) {
    this.category = category;
  }

  get Description(): string {
    return this.description;
  }

  set Description(description: string) {
    this.description = description;
  }

  get Price(): number {
    return this.price;
  }

  set Price(price: number) {
    this.price = price;
  }
}
