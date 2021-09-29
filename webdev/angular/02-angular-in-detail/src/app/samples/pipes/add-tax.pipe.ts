import { Pipe, PipeTransform } from "@angular/core";

/**
 * The following is a custom Pipe that accepts a price value and an optional
 * argument which represents a tax rate, and returns the final price including
 * the tax.
 *
 * The pipe's name for use in templates is `addTax` and it is used as follows:
 *
 * ...
 * {{ price | addTax:25 }}
 *
 * The `price` is used as a value to be provided to the pipe (AddTaxPipe.transform
 * method's first argument). The pipe's arguments (in this case the second argument
 * of the AddTaxPipe.transform method) is provided after the pipe's name and a color.
 * The generalized pipe usage syntax is:
 *
 * value | pipeName:arg1:arg2:...:argn
 *
 * @note By default, Angular invokes the pipe's transform method only when its input
 * value changes or any of its arguments change. However, note that Angular does not
 * automatically detect changes in content of arrays or object properties. This issue
 * can be solved by using impure pipes described in category-filter.pipe.ts.
 */
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
