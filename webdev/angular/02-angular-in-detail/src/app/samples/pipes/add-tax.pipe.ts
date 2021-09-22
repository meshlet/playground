import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  /**
   * This is the name used to reference the pipe within the template.
   */
  name: "addTax"
})
export class AddTaxPipe implements PipeTransform {
  private static defaultTaxRate = 10;

  transform(value: any, taxRate?: any): any {
    console.log(`Tax rate is: ${taxRate}`);
    const valueNum = Number.parseFloat(value);
    const taxRateNum = taxRate != undefined ? Number.parseFloat(taxRate) : AddTaxPipe.defaultTaxRate;
    return valueNum + (valueNum * (taxRateNum / 100));
  }
}
