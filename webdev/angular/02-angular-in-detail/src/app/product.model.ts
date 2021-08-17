export class Product {
  public id: number | undefined;
  public name:string;
  public category:string;
  public price:number;

  constructor(id?: number, name:string = '', category:string = '', price: number = 0) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
  }
}
