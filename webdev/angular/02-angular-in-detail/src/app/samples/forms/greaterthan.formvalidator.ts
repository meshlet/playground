/**
 * A custom validator which asserts that a given form control value is a number
 * greater than a lower boundary.
 */
import { FormControl } from "@angular/forms";

export class GreaterThanFormValidator {
  static GreaterThan(min: number) {
    return (control: FormControl) => {
      let value = Number(control.value);
      if (Number.isNaN(value) || value <= min) {
        return { "greaterThan": { "min": min, "actualValue": value } };
      }
      return null;
    }
  }
}
